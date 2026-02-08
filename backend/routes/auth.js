const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailService');

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

// Forgot Password - Request Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email, you will receive password reset instructions.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Save token to user (expires in 1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Determine the base URL (use environment variable or default)
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    
    // Send email
    try {
      await sendPasswordResetEmail(
        user.email, 
        resetUrl, 
        `${user.firstName} ${user.lastName}`
      );
      
      console.log('\n' + '='.repeat(80));
      console.log('🔐 PASSWORD RESET REQUEST');
      console.log('='.repeat(80));
      console.log(`📧 Email: ${email}`);
      console.log(`🔗 Reset Link: ${resetUrl}`);
      console.log(`⏰ Expires: ${new Date(user.resetPasswordExpires).toLocaleString()}`);
      console.log(`✅ Email sent successfully`);
      console.log('='.repeat(80) + '\n');
      
      res.json({ 
        message: 'Password reset instructions have been sent to your email.'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      
      // If email fails, still log the reset URL for development
      console.log('\n' + '='.repeat(80));
      console.log('⚠️  EMAIL FAILED - DEVELOPMENT FALLBACK');
      console.log('='.repeat(80));
      console.log(`📧 Email: ${email}`);
      console.log(`🔗 Reset Link: ${resetUrl}`);
      console.log(`⏰ Expires: ${new Date(user.resetPasswordExpires).toLocaleString()}`);
      console.log('='.repeat(80) + '\n');
      
      // In development, return the URL; in production, return generic message
      if (process.env.NODE_ENV === 'development') {
        res.json({ 
          message: 'Email service unavailable. Use the reset link from console.',
          resetUrl: resetUrl // Only for development
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to send reset email. Please try again later or contact support.' 
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token from URL
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
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
