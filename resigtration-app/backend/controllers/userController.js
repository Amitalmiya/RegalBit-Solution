const { pool, poolPhone, poolEmail } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'Amit@123$';

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
      role,
    } = req.body;

    const formattedDOB = new Date(dateOfBirth).toISOString().split("T")[0];
    const userTime = formatTimeToMySQL(timeFormat);

    const userRole = role && role.trim() ? role : "user";

    const [existing] = await pool.query(`SELECT * FROM users WHERE email = ? OR userName = ?`, [email, userName]) 

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists. "});
    }

    if (!userName || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
      (userName, email, phone, dateOfBirth, socialSecurityNo, driverLicense, gender, bloodGroup, zipCode, websiteUrl, creditCardNo, timeFormat, hexaDecimalColorCode,password, password_hash, role)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        userRole,
      ]
    );


    const token = jwt.sign(
      { id: result.insertId, userName, email, phone },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(201).json({
      id: result.insertId,
      userName,
      email,
      phone,
      token,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const allUsers = async (req, res) => {
  try {

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({message: "Access denied"});
    }

    const [mainUsers] = await pool.query("SELECT * FROM users");

    const [ phoneUsers ] = await poolPhone.query(`SELECT * FROM users`);

    const [ emailUsers ] = await poolEmail.query(`SELECT * FROM users`);

    const allUsers = [...mainUsers, ...phoneUsers, ...emailUsers]
    res.status(200).json({
      message : "All users fetched successfully",
      totalUsers: allUsers.length,
      allUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [mainUsers] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    const [phoneUsers] = await poolPhone.query("SELECT * FROM users WHERE id = ?", [id]);

    const [emailUsers] = await poolEmail.query("SELECT * FROM users WHERE id = ?", [id]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0] || null;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({message: "User fetched Successfully", user});
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

    const [resultMain] = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );

    const [resultPhone] = await poolPhone.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );

    const [resultEmail] = await poolEmail.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );

    if (resultMain.affectedRows === 0 && resultPhone.affectedRows === 0 && resultEmail.affectedRows === 0) {
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
    
    const [resultMain] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    const [resultPhone] = await poolPhone.query("DELETE FROM users WHERE id = ?", [id]);

    const [resultEmail] = await poolEmail.query("DELETE FROM users WHERE id = ?", [id]);

    if (resultMain.affectedRows === 0 && resultPhone.affectedRows === 0 && resultEmail.affectedRows === 0) {
      return res.status(404).json({ message: "User not found in any database" });
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

    const [resultMain] = await pool.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [status, id]
    );

    const [resultPhone] = await poolPhone.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [status, id]
    );

    const [resultEmail] = await poolEmail.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (resultMain.affectedRows === 0 && resultPhone.affectedRows === 0 && resultEmail.affectedRows === 0) {
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
  
  try {
  
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

    const [mainUsers] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [
      userName
    ]);
    
    const [phoneUsers] = await poolPhone.query(`SELECT * FROM users WHERE userName = ?`, [
      userName
    ]);


    const [emailUsers] = await poolEmail.query(`SELECT * FROM users WHERE userName = ?`, [
      userName
    ]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0];

    if(!user){
      return res.status(401).json({message: "Invalid username or password from database"})
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({message: "Invalid username or password"});
    }

    const token = jwt.sign(
      {id: user.id,
        userName: user.userName,
        role: user.role || "user"
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
 
    res.status(200).json({
      message: "Login successfully",
      token,
      user: { id: user.id, userName: user.userName, role: user.role || "user",},
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    if(req.user.id != userId) {
      return res.status(403).json({message: "Unauthorized access"});
    }

    const [mainUsers] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
 
    const [phoneUsers] = await poolPhone.query(`SELECT id, userName, phone FROM users WHERE id = ?`, [userId]);

    const [emailUsers] = await poolEmail.query(`SELECT id, userName, email FROM users WHERE id = ?`, [userId]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0] || null;
    
    if(!user) {
      return res.status(404).json({message: "User not found"});
    }

    res.status(200).json({
     message: "Profile fetched successfully",
     user,
    })
  } catch(error) {
    console.error("getUserProfile Error:", error);
    res.status(500).json({message: "Server Error"})
  }
}


const getUserFromToken = async (token) => {
  try{
    if(!token) {
      return {success: false, message: "Token missing"};
    }

    const trimmedToken = token.replace(/^Bearer\s+/i, "").trim();
    console.log("Recived Token: ", trimmedToken);

    const decoded = jwt.verify(trimmedToken, JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const [mainUsers] = await pool.query(`SELECT id, userName, email, phone FROM users WHERE id = ?`, [decoded.id]);

    const [phoneUsers] = await poolPhone.query(`SELECT id, userName, phone FROM users WHERE id = ?`, [decoded.id]);

    const [emailUsers] = await poolEmail.query(`SELECT id, userName, email FROM users WHERE id = ?`, [decoded.id]);

    const user = mainUsers[0] || phoneUsers[0] || emailUsers[0] || null;
    
    if(!user){
      return {success: false, message: "User not found"}
    }
    return {success: true, user}
  }catch (error) {
    console.log("Token Verification error:", error.message);
    return {success: false, message: "Invalid or expired token"}
  }
}

module.exports = {
  userRegistration,
  loginUser,
  getUserProfile,
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserFromToken, 
};
