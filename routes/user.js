const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { signup, verifyOtp, login, resetPassword } = require('../controller/user.controller');

router.post('/reset-password', authMiddleware,resetPassword);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/signup', signup);


module.exports = router;