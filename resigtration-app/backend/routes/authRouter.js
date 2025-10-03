const express = require('express');
const router = express.Router();

const { requestPhoneOtp, verifyPhoneOtp, requestEmailOtp, verifyEmailOtp, allUsers } = require('../controllers/authController')

router.post("/signup/requestphone-otp", requestPhoneOtp);
router.post("/signup/verifyphone-otp", verifyPhoneOtp);

router.post("/signup/requestemail-otp", requestEmailOtp);
router.post("/signup/verifyemail-otp", verifyEmailOtp);

router.get("/:id", allUsers);

module.exports = router;