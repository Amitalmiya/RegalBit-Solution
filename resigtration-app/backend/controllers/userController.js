const { pool, poolPhone, poolEmail } = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../utils/tokenHelpers");


function formatTimeToMySQL(timeStr) {
  if (!timeStr) return null;
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
}


const userRegistration = async (req, res) => {
  try {
    const {
      userName, email, phone, dateOfBirth, socialSecurityNo,
      driverLicense, gender, bloodGroup, zipCode, websiteUrl,
      creditCardNo, timeFormat, hexaDecimalColorCode, password, role,
    } = req.body;

    if (!userName || !email) {
      return res.status(400).json({ message: "Name and Email are required." });
    }

    const [existing] = await pool.query(
      `SELECT * FROM users WHERE email = ? OR userName = ?`,
      [email, userName]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    const formattedDOB = new Date(dateOfBirth).toISOString().split("T")[0];
    const userRole = "user";
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
      (userName, email, phone, dateOfBirth, socialSecurityNo, driverLicense,
      gender, bloodGroup, zipCode, websiteUrl, creditCardNo, timeFormat,
      hexaDecimalColorCode, password, password_hash, role)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userName, email, phone, formattedDOB, socialSecurityNo, driverLicense,
        gender, bloodGroup, zipCode, websiteUrl, creditCardNo, timeFormat,
        hexaDecimalColorCode, password, password_hash, userRole
      ]
    );

    const token = generateToken(result.insertId, userRole);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertId, userName, role: userRole },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [mainUsers] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [userName]);
    const [phoneUsers] = await poolPhone.query(`SELECT * FROM users WHERE userName = ?`, [userName]);
    const [emailUsers] = await poolEmail.query(`SELECT * FROM users WHERE userName = ?`, [userName]);
    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0];

    if (!user) return res.status(401).json({ message: "Invalid username or password." });
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password." });

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: "Login successfully",
      token,
      user: { id: user.id, userName: user.userName, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [mainUsers] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    const [phoneUsers] = await poolPhone.query(`SELECT id, userName, phone FROM users WHERE id = ?`, [userId]);
    const [emailUsers] = await poolEmail.query(`SELECT id, userName, email FROM users WHERE id = ?`, [userId]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0];
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


const getUserFromToken = async (token) => {
  try {
    if (!token) return { success: false, message: "Token missing" };
    const trimmedToken = token.replace(/^Bearer\s+/i, "").trim();
    const decoded = verifyToken(trimmedToken);
    if (!decoded) return { success: false, message: "Invalid or expired token" };

    const [mainUsers] = await pool.query(`SELECT * FROM users WHERE id = ?`, [decoded.id]);
    const [phoneUsers] = await poolPhone.query(`SELECT * FROM users WHERE id = ?`, [decoded.id]);
    const [emailUsers] = await poolEmail.query(`SELECT * FROM users WHERE id = ?`, [decoded.id]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0];
    if (!user) return { success: false, message: "User not found" };

    return { success: true, user };
  } catch (err) {
    console.error("Token Verification error:", err.message);
    return { success: false, message: "Invalid or expired token" };
  }
};


const allUsers = async (req, res) => {
  try {
    if (!["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const [mainUsers] = await pool.query("SELECT * FROM users");
    const [phoneUsers] = await poolPhone.query("SELECT * FROM users");
    const [emailUsers] = await poolEmail.query("SELECT * FROM users");

    const allUsers = [
      ...(mainUsers?.map(u => ({ ...u, source: "main", uniqueId: `main-${u.id}` })) || []),
      ...(phoneUsers?.map(u => ({ ...u, source: "phone", uniqueId: `phone-${u.id}` })) || []),
      ...(emailUsers?.map(u => ({ ...u, source: "email", uniqueId: `email-${u.id}` })) || []),
    ];

    res.status(200).json({ message: "All users fetched successfully", totalUsers: allUsers.length, allUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [mainUsers] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    const [phoneUsers] = await poolPhone.query("SELECT * FROM users WHERE id = ?", [id]);
    const [emailUsers] = await poolEmail.query("SELECT * FROM users WHERE id = ?", [id]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    if (!Object.keys(fields).length) return res.status(400).json({ message: "No fields to update" });

    const setClause = Object.keys(fields).map(field => `${field} = ?`).join(", ");
    const values = [...Object.values(fields), id];

    const [resultMain] = await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    const [resultPhone] = await poolPhone.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    const [resultEmail] = await poolEmail.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);

    if (resultMain.affectedRows === 0 && resultPhone.affectedRows === 0 && resultEmail.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [resultMain] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    const [resultPhone] = await poolPhone.query("DELETE FROM users WHERE id = ?", [id]);
    const [resultEmail] = await poolEmail.query("DELETE FROM users WHERE id = ?", [id]);

    if (resultMain.affectedRows === 0 && resultPhone.affectedRows === 0 && resultEmail.affectedRows === 0) {
      return res.status(404).json({ message: "User not found in any database" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const userStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    if (!["active", "deactivate"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const dbStatus = status === "deactivate" ? "deactive" : "active";

    const [resultMain] = await pool.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [dbStatus, id]
    );
    const [resultPhone] = await poolPhone.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [dbStatus, id]
    );
    const [resultEmail] = await poolEmail.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [dbStatus, id]
    );

    if (
      resultMain.affectedRows === 0 &&
      resultPhone.affectedRows === 0 &&
      resultEmail.affectedRows === 0
    ) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${status === "deactivate" ? "deactivated" : "activated"} successfully`,
      status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};



module.exports = {
  userRegistration,
  loginUser,
  getUserProfile,
  getUserFromToken,
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
  userStatus,
};
