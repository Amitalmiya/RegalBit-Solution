const { poolPhone, poolEmail } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "Amit@123$";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const requestPhoneOtp = async (req, res) => {
  try {
    const { phone, userName, password } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });
    if (!userName || !password)
      return res.status(400).json({ error: "Username and password required" });

    const [existingUser] = await poolPhone.query(
      `SELECT * FROM users WHERE phone =? OR userName = ?`,
      [phone, userName]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Phone or Username already exists. Please login." });
    }

    const otp = generateOtp();
    const expireAt = new Date(Date.now() + 1 * 60 * 1000);

    await poolPhone.query(
      `INSERT INTO otps (contact, otp, purpose, expires_at) VALUES (?, ?, ?, ?)`,
      [phone, otp, "signup", expireAt]
    );

    res.json({ message: "OTP sent to phone", otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};




const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, userName, password, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ error: "Phone and OTP required" });

    // 1️⃣ Fetch latest OTP
    const [otpRows] = await poolPhone.query(
      `SELECT * FROM otps WHERE contact=? AND purpose='signup' AND is_verified=0 ORDER BY created_at DESC LIMIT 1`,
      [phone]
    );
    if (!otpRows.length) return res.status(400).json({ error: "No OTP found" });

    const otpRecord = otpRows[0];

    // 2️⃣ Check OTP expiration
    if (new Date(otpRecord.expires_at) < new Date())
      return res.status(400).json({ error: "OTP expired" });

    // 3️⃣ Check user existence
    const [users] = await poolPhone.query(`SELECT * FROM users WHERE phone=? LIMIT 1`, [phone]);
    const user = users[0];

    if (user?.permanently_blocked)
      return res.status(403).json({ error: "Account permanently blocked. Contact admin." });

    // If temporarily blocked, show remaining time
    if (user?.blocked_until && new Date(user.blocked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.blocked_until) - new Date()) / 60000);
      return res.status(403).json({ error: `Try again in ${minutesLeft} minutes` });
    }

    // 4️⃣ Validate OTP
    if (String(otpRecord.otp) !== String(otp)) {
      let failedAttempts = (user?.failed_attempts || 0) + 1;

      // Define lock durations (in minutes)
      const lockDurations = [0, 2, 4]; // 1st fail: 0, 2nd: 2 mins, 3rd: 4 mins

      // If reached 3 or more failed attempts => permanently blocked
      if (failedAttempts >= 3) {
        await poolPhone.query(
          `UPDATE users SET permanently_blocked=1 WHERE phone=?`,
          [phone]
        );
        return res
          .status(403)
          .json({ error: "Account permanently blocked after 3 wrong attempts." });
      }

      // Set temporary block
      const blockTime = lockDurations[failedAttempts] || 0;
      const blockedUntil = blockTime
        ? new Date(Date.now() + blockTime * 60 * 1000)
        : null;

      if (user) {
        await poolPhone.query(
          `UPDATE users SET failed_attempts=?, blocked_until=? WHERE phone=?`,
          [failedAttempts, blockedUntil, phone]
        );
      }

      return res.status(400).json({
        error: blockTime
          ? `Wrong OTP. Try again in ${blockTime} minutes.`
          : "Invalid OTP.",
      });
    }

    // 5️⃣ If OTP is correct — reset failed attempts
    if (user) {
      await poolPhone.query(
        `UPDATE users SET failed_attempts=0, blocked_until=NULL WHERE phone=?`,
        [phone]
      );
      return res.status(400).json({ error: "User already exists" });
    }

    // 6️⃣ Mark OTP verified
    await poolPhone.query(`UPDATE otps SET is_verified=1 WHERE id=?`, [otpRecord.id]);

    // 7️⃣ Hash password and create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await poolPhone.query(
      `INSERT INTO users (userName, phone, password_hash, role) VALUES (?, ?, ?, ?)`,
      [userName, phone, passwordHash, "user"]
    );

    // 8️⃣ Generate JWT
    const token = jwt.sign(
      { id: result.insertId, userName, phone, role: "user" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created and logged in successfully via phone",
      token,
      user: { id: result.insertId, userName, phone },
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


const requestEmailOtp = async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    if (!userName || !password)
      return res.status(400).json({ error: "Username and password required" });

    const [existingUser] = await poolEmail.query(
      `SELECT * FROM users WHERE email =? OR userName = ?`,
      [email.toLowerCase(), userName]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Email or Username already exists. Please login." });
    }

    const otp = generateOtp();

    const expireAt = new Date(Date.now() + 1 * 60 * 1000);

    await poolEmail.query(
      `INSERT INTO otps (contact, otp, purpose, expires_at) VALUES (?, ?, ?, ?)`,
      [email.toLowerCase(), otp, "signup", expireAt]
    );

    res.json({ message: "OTP sent to email", otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, userName, password, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP required" });

    const emailLower = email.toLowerCase();

    const [otpRows] = await poolEmail.query(
      `SELECT * FROM otps 
       WHERE contact=? AND purpose='signup' AND is_verified=0 
       ORDER BY created_at DESC LIMIT 1`,
      [emailLower]
    );

    if (!otpRows.length)
      return res.status(400).json({ error: "No OTP found or already used" });

    const otpRecord = otpRows[0];

    if (new Date(otpRecord.expires_at) < new Date())
      return res.status(400).json({ error: "OTP expired" });

    const [users] = await poolEmail.query(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [emailLower]
    );

    const user = users[0];

    if (user?.permanently_blocked) {
      return res
        .status(403)
        .json({ error: "Account permanently blocked. Contact admin." });
    }

    if (user?.blocked_until && new Date(user.blocked_until) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(user.blocked_until) - new Date()) / 60000
      );
      return res
        .status(403)
        .json({ error: `Try again in ${minutesLeft} minutes` });
    }

    if (String(otpRecord.otp) !== String(otp)) {
      const failedAttempts = (user?.failed_attempts || 0) + 1;
      let blockTime = 0;

      if (failedAttempts === 1) blockTime = 1;
      if (failedAttempts === 2) blockTime = 2; 
      if (failedAttempts === 3) blockTime = 5; 

      if (failedAttempts >= 4) {
        await poolEmail.query(
          `UPDATE users SET permanently_blocked=1 WHERE email=?`,
          [emailLower]
        );
        return res
          .status(403)
          .json({ error: "Account permanently blocked. Contact admin." });
      }

      const blockedUntil = new Date(Date.now() + blockTime * 60 * 1000);

      if (user) {
        await poolEmail.query(
          `UPDATE users 
           SET failed_attempts=?, blocked_until=? 
           WHERE email=?`,
          [failedAttempts, blockedUntil, emailLower]
        );
      }

      return res.status(400).json({
        error: `Wrong OTP. Try again in ${blockTime} minute${
          blockTime > 1 ? "s" : ""
        }`,
      });
    }

    if (user) {
      await poolEmail.query(
        `UPDATE users SET failed_attempts=0, blocked_until=NULL WHERE email=?`,
        [emailLower]
      );

      const token = jwt.sign(
        { id: user.id, userName: user.userName, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "User logged in successfully",
        token,
        user: { id: user.id, userName: user.userName, email: user.email },
      });
    }

    await poolEmail.query("UPDATE otps SET is_verified=1 WHERE id=?", [
      otpRecord.id,
    ]);

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await poolEmail.query(
      `INSERT INTO users (userName, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [userName, emailLower, passwordHash, "user"]
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        userName,
        email: emailLower,
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "User created and logged in with email successfully",
      token,
      user: { id: result.insertId, userName, email: emailLower },
    });
  } catch (err) {
    console.error("verifyEmailOtp Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  requestPhoneOtp,
  verifyPhoneOtp,
  requestEmailOtp,
  verifyEmailOtp,
};
