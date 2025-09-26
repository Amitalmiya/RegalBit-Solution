const express = require('express');
const router = express.Router();

const { requestSignupOtp, verifySignupOtp, requestLoginOtp, verifyLoginOtp } = require('../controllers/authController')

router.post("/signup/request-otp", requestSignupOtp);
router.post("/signup/verify-top", verifySignupOtp);

router.post("/login/request-otp", requestLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);


module.exports = router;