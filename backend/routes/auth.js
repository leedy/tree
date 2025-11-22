import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Team from '../models/Team.js';
import Season from '../models/Season.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper function to get or create current season
const getCurrentSeason = async () => {
  const now = new Date();
  const year = now.getFullYear();

  // Try to find active season
  let season = await Season.findOne({ isActive: true });

  if (!season) {
    // Create new season for current year
    // Black Friday is the 4th Friday after Thanksgiving (4th Thursday in November)
    // For simplicity, approximate to November 25
    const startDate = new Date(year, 10, 25); // Month is 0-indexed, so 10 = November
    const endDate = new Date(year, 11, 24); // December 24

    season = await Season.create({
      year,
      startDate,
      endDate,
      isActive: true
    });
  }

  return season;
};

// Register a new team
router.post('/register', async (req, res) => {
  try {
    const { teamName, email, password } = req.body;

    // Validation
    if (!teamName || !email || !password) {
      return res.status(400).json({ message: 'Team name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if team name already exists
    const existingTeamName = await Team.findOne({ teamName });
    if (existingTeamName) {
      return res.status(409).json({ message: 'Team name already exists' });
    }

    // Check if email already exists
    const existingEmail = await Team.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Get or create current season
    const season = await getCurrentSeason();

    // Create new team
    const team = await Team.create({
      teamName,
      email,
      password,
      season: season._id,
      players: []
    });

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team._id, teamName: team.teamName, email: team.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Team registered successfully',
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        players: team.players,
        season: season.year
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find team by email
    const team = await Team.findOne({ email: email.toLowerCase() }).populate('season');
    if (!team) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await team.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team._id, teamName: team.teamName, email: team.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        players: team.players,
        totalCount: team.getTotalCount(),
        season: team.season.year
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find team by email
    const team = await Team.findOne({ email: email.toLowerCase() });

    // Don't reveal if email exists or not for security
    if (!team) {
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token before storing (extra security)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (1 hour)
    team.resetToken = hashedToken;
    team.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await team.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;

    // Send email
    await sendPasswordResetEmail({
      email: team.email,
      teamName: team.teamName,
      resetToken,
      resetUrl
    });

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing password reset request' });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find team with valid token
    const team = await Team.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!team) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password (will be hashed by pre-save hook)
    team.password = newPassword;
    team.resetToken = null;
    team.resetTokenExpiry = null;
    await team.save();

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

export default router;
