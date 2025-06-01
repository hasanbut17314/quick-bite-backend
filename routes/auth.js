import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Email must be a valid Gmail address." });
  }

  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: "Password must include uppercase, lowercase, digit, and special character." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  res.status(201).json({ message: "User registered successfully." });
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // ✅ Send token + user info
  res.status(200).json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name || '', 
      image: user.image || '', 
    },
    message: "Login successful"
  });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found." });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - QuickBite",
    html: `
      <h2>Password Reset - QuickBite</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
         style="display:inline-block;padding:10px 20px;background:#d44480;color:#fff;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
      <p>This link will expire in 10 minutes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Email could not be sent. Please try again later." });
  }
});

export default router;
