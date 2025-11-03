import express from 'express';
import Team from '../models/Team.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current team details
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findById(req.teamId).populate('season');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      id: team._id,
      teamName: team.teamName,
      players: team.players,
      totalCount: team.getTotalCount(),
      season: team.season.year,
      createdAt: team.createdAt
    });
  } catch (error) {
    console.error('Error fetching team:', error);
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

    const team = await Team.findById(req.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.count += amount;
    await team.save();

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

    const team = await Team.findById(req.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.count = Math.max(0, player.count - amount); // Don't go below 0
    await team.save();

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

export default router;
