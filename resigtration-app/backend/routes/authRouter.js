const express = require('express');
const router = express.Router();

const {authenticateToken} = require('../middleware/authMiddleware')

const { requestPhoneOtp, verifyPhoneOtp, requestEmailOtp, verifyEmailOtp, allUsers } = require('../controllers/authController')

router.post("/signup/requestphone-otp", requestPhoneOtp);
router.post("/signup/verifyphone-otp", verifyPhoneOtp);

router.post("/signup/requestemail-otp", requestEmailOtp);
router.post("/signup/verifyemail-otp", verifyEmailOtp);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to your profile!!",
        user: req.user,
    })
})

router.get('/home', authenticateToken, (req, res) => {
    res.json({
        message: `Welcome ${req.user.userName}! This is your dashboard.`,
        user: req.user,
    })
})

module.exports = router;