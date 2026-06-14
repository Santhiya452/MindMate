const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, login } = require('../controllers/authControllers');

router.post('/register', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;