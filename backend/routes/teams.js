import express from 'express';
import Team from '../models/Team.js';
import Activity from '../models/Activity.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current team details
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findById(req.teamId).populate('season');

    if (!team) {
      console.error('Team not found for ID:', req.teamId);
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.season) {
      console.error('Team has no season:', team.teamName, team._id);
      return res.status(500).json({ message: 'Team has no season associated' });
    }

    res.json({
      id: team._id,
      teamName: team.teamName,
      email: team.email,
      players: team.players,
      totalCount: team.getTotalCount(),
      season: team.season.year,
      seasonStartDate: team.season.startDate,
      allowAddingTrees: team.season.allowAddingTrees !== undefined ? team.season.allowAddingTrees : true,
      createdAt: team.createdAt
    });
  } catch (error) {
    console.error('Error fetching team:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a player to the team
router.post('/players', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Player name is required' });
    }

    const team = await Team.findById(req.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if player name already exists in team
    const existingPlayer = team.players.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (existingPlayer) {
      return res.status(409).json({ message: 'Player name already exists in team' });
    }

    // Add player
    team.players.push({ name: name.trim(), count: 0 });
    await team.save();

    res.status(201).json({
      message: 'Player added successfully',
      players: team.players,
      totalCount: team.getTotalCount()
    });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update player name
router.put('/players/:playerId', authenticateToken, async (req, res) => {
  try {
    const { playerId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Player name is required' });
    }

    const team = await Team.findById(req.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if new name conflicts with existing player
    const existingPlayer = team.players.find(p =>
      p._id.toString() !== playerId &&
      p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existingPlayer) {
      return res.status(409).json({ message: 'Player name already exists in team' });
    }

    player.name = name.trim();
    await team.save();

    res.json({
      message: 'Player updated successfully',
      players: team.players,
      totalCount: team.getTotalCount()
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a player
router.delete('/players/:playerId', authenticateToken, async (req, res) => {
  try {
    const { playerId } = req.params;

    const team = await Team.findById(req.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.deleteOne();
    await team.save();

    res.json({
      message: 'Player deleted successfully',
      players: team.players,
      totalCount: team.getTotalCount()
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment player count
router.post('/players/:playerId/increment', authenticateToken, async (req, res) => {
  try {
    const { playerId } = req.params;
    const { amount = 1 } = req.body; // Default increment by 1

    if (amount < 1 || amount > 100) {
      return res.status(400).json({ message: 'Invalid increment amount (must be 1-100)' });
    }

    const team = await Team.findById(req.teamId).populate('season');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if adding trees is allowed for this season
    if (!team.season.allowAddingTrees) {
      return res.status(403).json({ message: 'Adding trees is currently disabled' });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.count += amount;
    await team.save();

    // Log activity
    try {
      await Activity.create({
        type: 'tree_spotted',
        teamId: team._id,
        teamName: team.teamName,
        playerId: player._id,
        playerName: player.name,
        count: amount,
        newTotal: player.count,
        season: team.season._id
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
      // Don't fail the request if activity logging fails
    }

    res.json({
      message: 'Count updated successfully',
      player: {
        id: player._id,
        name: player.name,
        count: player.count
      },
      totalCount: team.getTotalCount()
    });
  } catch (error) {
    console.error('Error incrementing count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decrement player count
router.post('/players/:playerId/decrement', authenticateToken, async (req, res) => {
  try {
    const { playerId } = req.params;
    const { amount = 1 } = req.body;

    if (amount < 1 || amount > 100) {
      return res.status(400).json({ message: 'Invalid decrement amount (must be 1-100)' });
    }

    const team = await Team.findById(req.teamId).populate('season');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if adding trees is allowed for this season
    if (!team.season.allowAddingTrees) {
      return res.status(403).json({ message: 'Adding trees is currently disabled' });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.count = Math.max(0, player.count - amount); // Don't go below 0
    await team.save();

    // Log activity
    try {
      await Activity.create({
        type: 'tree_removed',
        teamId: team._id,
        teamName: team.teamName,
        playerId: player._id,
        playerName: player.name,
        count: amount,
        newTotal: player.count,
        season: team.season._id
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
      // Don't fail the request if activity logging fails
    }

    res.json({
      message: 'Count updated successfully',
      player: {
        id: player._id,
        name: player.name,
        count: player.count
      },
      totalCount: team.getTotalCount()
    });
  } catch (error) {
    console.error('Error decrementing count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const team = await Team.findById(req.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Verify current password
    const isPasswordValid = await team.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    team.password = newPassword;
    await team.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
