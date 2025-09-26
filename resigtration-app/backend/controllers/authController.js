const { pool } = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { error } = require('console');

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); 
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

const requestSignupOtp = async (req, res) => {
  try {
    const { phone, email, userName, password } = req.body;
    
    if (!phone && !email) {
      return res.status(400).json({ error: 'Phone or Email required' });
    }
    if (!userName || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expireAt = new Date(Date.now() + 1 * 60 * 1000); 
    const contact = phone || email;

    await pool.query(
      `INSERT INTO otps (contact, otp_hash, purpose, expires_at) VALUES (?, ?, ?, ?)`,
      [contact, otpHash, 'signup', expireAt]
    );

    res.json({ message: 'OTP sent for signup', otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};



const verifySignupOtp = async (req, res) => {
  try {
    const { phone, email, userName, password, otp } = req.body;
    const contact = phone || email;

    if (!otp) return res.status(400).json({ error: 'OTP required' });

    const otpHash = hashOtp(otp);

    const [rows] = await pool.query(
      `SELECT * FROM otps 
       WHERE contact = ? AND purpose='signup' AND is_verified=0
       ORDER BY created_at DESC LIMIT 1`,
      [contact]
    );

    if (!rows.length) return res.status(400).json({ error: 'No OTP found' });

    const record = rows[0];

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (record.otp_hash !== otpHash) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await pool.query('UPDATE otps SET is_verified=1 WHERE id=?', [record.id]);

    const [existing] = await pool.query(
      `SELECT * FROM users WHERE phone= ? OR EMAIL=? LIMIT 1`,
      [phone, email]
    );

    if (existing.length) return res.status(400).json({error: 'USer already Exist'})

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (userName, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
      [userName, email, phone, passwordHash]
    );

    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};




const requestLoginOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const contact = phone || email;

    if (!contact) return res.status(400).json({ error: 'Phone or Email required' });

    const [users] = await pool.query(
      `SELECT * FROM users WHERE phone = ? OR email = ? LIMIT 1`,
      [contact, contact]
    );

    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO otps (contact, otp_hash, purpose, expires_at) VALUES (?, ?, ?, ?)`,
      [contact, otpHash, 'login', expireAt]
    );

    res.json({ message: 'OTP sent for login', otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};



const verifyLoginOtp = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    const contact = phone || email;

    if (!otp) return res.status(400).json({ error: 'OTP required' });

    const otpHash = hashOtp(otp);

    const [rows] = await pool.query(
      `SELECT * FROM otps 
       WHERE contact = ? AND purpose='login' AND is_verified=0
       ORDER BY created_at DESC LIMIT 1`,
      [contact]
    );

    if (!rows.length) return res.status(400).json({ error: 'No OTP found' });

    const record = rows[0];

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (record.otp_hash !== otpHash) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await pool.query('UPDATE otps SET is_verified=1 WHERE id=?', [record.id]);

    const [users] = await pool.query(
      `SELECT id, userName, email, phone FROM users WHERE phone=? OR email=? LIMIT 1`,
      [contact, contact]
    );

    const user = users[0];

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  requestSignupOtp,
  verifySignupOtp,
  requestLoginOtp,
  verifyLoginOtp,
};
