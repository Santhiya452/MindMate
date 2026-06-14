const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// OTP store (temporary)
const otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp, name, password,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await transporter.sendMail({
      from: `"MindMate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your MindMate OTP Code',
      html: `
        <div style="font-family:Poppins,sans-serif;max-width:480px;margin:auto;background:#0f172a;padding:40px;border-radius:16px;border:1px solid rgba(124,58,237,0.3)">
          <h2 style="color:#a78bfa;text-align:center">MindMate 🧠</h2>
          <p style="color:#cbd5e1">Hi ${name}! Your OTP code is:</p>
          <div style="text-align:center;font-size:36px;font-weight:800;color:#22d3ee;letter-spacing:10px;padding:20px;background:rgba(124,58,237,0.1);border-radius:12px;margin:20px 0">
            ${otp}
          </div>
          <p style="color:#4a5578;font-size:12px">This OTP expires in 10 minutes. Do not share it with anyone!</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP sent successfully!' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ message: 'OTP expired or not found!' });
    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired!' });
    }
    if (stored.otp !== otp) return res.status(400).json({ message: 'Invalid OTP!' });

    const hashedPassword = await bcrypt.hash(stored.password, 10);
    const user = await User.create({
      name: stored.name,
      email,
      password: hashedPassword,
    });

    delete otpStore[email];

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, login };