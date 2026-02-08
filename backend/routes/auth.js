const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/otpEmailService');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({ firstName, lastName, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email, you will receive an OTP.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to user (expires in 10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(user.email, otp, `${user.firstName} ${user.lastName}`);
      
      res.json({ 
        message: 'OTP has been sent to your email.',
        success: true
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      
      // In development, return OTP in response for testing
      if (process.env.NODE_ENV === 'development') {
        res.json({ 
          message: 'Email service unavailable. OTP shown for development.',
          success: true,
          otp: otp // Only for development
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to send OTP. Please try again later.' 
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ OTP VERIFIED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`📧 Email: ${email}`);
    console.log(`👤 User: ${user.firstName} ${user.lastName}`);
    console.log('='.repeat(80) + '\n');

    res.json({ 
      message: 'OTP verified successfully',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password with OTP
router.post('/reset-password-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update password
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    console.log('\n' + '='.repeat(80));
    console.log('✅ PASSWORD RESET SUCCESSFUL');
    console.log('='.repeat(80));
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 User: ${user.firstName} ${user.lastName}`);
    console.log('='.repeat(80) + '\n');

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
