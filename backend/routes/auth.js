import express from 'express';
import jwt from 'jsonwebtoken';
import Team from '../models/Team.js';
import Season from '../models/Season.js';
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
    const { teamName, password } = req.body;

    // Validation
    if (!teamName || !password) {
      return res.status(400).json({ message: 'Team name and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(409).json({ message: 'Team name already exists' });
    }

    // Get or create current season
    const season = await getCurrentSeason();

    // Create new team
    const team = await Team.create({
      teamName,
      password,
      season: season._id,
      players: []
    });

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team._id, teamName: team.teamName },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Team registered successfully',
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
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
    const { teamName, password } = req.body;

    // Validation
    if (!teamName || !password) {
      return res.status(400).json({ message: 'Team name and password are required' });
    }

    // Find team
    const team = await Team.findOne({ teamName }).populate('season');
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
      { teamId: team._id, teamName: team.teamName },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
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

export default router;
