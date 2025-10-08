const express = require("express");
const router = express.Router();

const { pool, poolPhone, poolEmail } = require("../config/db");

const { authenticateToken } = require("../middleware/authMiddleware");

const {
  requestPhoneOtp,
  verifyPhoneOtp,
  requestEmailOtp,
  verifyEmailOtp,
} = require("../controllers/authController");

router.post("/signup/requestphone-otp", requestPhoneOtp);
router.post("/signup/verifyphone-otp", verifyPhoneOtp);

router.post("/signup/requestemail-otp", requestEmailOtp);
router.post("/signup/verifyemail-otp", verifyEmailOtp);

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [mainUsers] = await pool.query(
      `SELECT id, userName, email, phone FROM users WHERE id = ?`,
      [userId]
    );

    const [phoneUsers] = await poolPhone.query(
      `SELECT id, userName, phone FROM users WHERE id = ?`,
      [userId]
    );

    const [EmailUsers] = await poolEmail.query(
      `SELECT id, userName, email FROM users WHERE id = ?`,
      [userId]
    );

    const user = mainUsers[0] || phoneUsers[0] || EmailUsers[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Welcome to your profile!!",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/home", authenticateToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.userName}! This is your dashboard.`,
    user: req.user,
  });
});

module.exports = router;
