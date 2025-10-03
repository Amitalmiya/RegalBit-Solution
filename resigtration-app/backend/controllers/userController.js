const { pool } = require("../config/db");
const bcrypt = require("bcrypt");

let users = [];

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
      userName,
      email,
      phone,
      dateOfBirth,
      socialSecurityNo,
      driverLicense,
      gender,
      bloodGroup,
      zipCode,
      websiteUrl,
      creditCardNo,
      timeFormat,
      hexaDecimalColorCode,
      password,
    } = req.body;

    const formattedDOB = new Date(dateOfBirth).toISOString().split("T")[0];
    const userTime = formatTimeToMySQL(timeFormat);

    if (!userName || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
      (userName, email, phone, dateOfBirth, socialSecurityNo, driverLicense, gender, bloodGroup, zipCode, websiteUrl, creditCardNo, timeFormat, hexaDecimalColorCode,password, password_hash)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userName,
        email,
        phone,
        formattedDOB,
        socialSecurityNo,
        driverLicense,
        gender,
        bloodGroup,
        zipCode,
        websiteUrl,
        creditCardNo,
        timeFormat,
        hexaDecimalColorCode,
        password,
        password_hash,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      userName,
      email,
      phone,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (!Object.keys(fields).length) {
      return res.status(400).json({ message: "No fields to Update" });
    }

    const setClause = Object.keys(fields)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = [...Object.values(fields), id];

    const [result] = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User update successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Delete Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await pool.query(
      `UPDATE users SET status = ? WHERE ID = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${status ? "activate" : "deactivated"}successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [
      userName,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password " });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({message: "Inavalid username or password"})
    }
 
    res.status(200).json({
      message: "Login successfully",
      user: { id: user.id, userName: user.userName, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  userRegistration,
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  loginUser,
};
