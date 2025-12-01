import express from 'express';
import Team from '../models/Team.js';
import Season from '../models/Season.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Get team leaderboard
router.get('/teams', async (req, res) => {
  try {
    const { season: seasonYear } = req.query;

    let seasonFilter = {};
    if (seasonYear) {
      const season = await Season.findOne({ year: parseInt(seasonYear) });
      if (season) {
        seasonFilter.season = season._id;
      }
    } else {
      // Default to current active season
      const activeSeason = await Season.findOne({ isActive: true });
      if (activeSeason) {
        seasonFilter.season = activeSeason._id;
      }
    }

    const teams = await Team.find(seasonFilter).populate('season');

    // Calculate totals and sort
    const leaderboard = teams.map(team => ({
      id: team._id,
      teamName: team.teamName,
      totalCount: team.getTotalCount(),
      playerCount: team.players.length,
      season: team.season.year,
      updatedAt: team.updatedAt
    })).sort((a, b) => b.totalCount - a.totalCount);

    res.json({
      leaderboard,
      season: seasonFilter.season ? teams[0]?.season?.year ?? null : null
    });
  } catch (error) {
    console.error('Error fetching team leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get individual player leaderboard
router.get('/players', async (req, res) => {
  try {
    const { season: seasonYear } = req.query;

    let seasonFilter = {};
    if (seasonYear) {
      const season = await Season.findOne({ year: parseInt(seasonYear) });
      if (season) {
        seasonFilter.season = season._id;
      }
    } else {
      // Default to current active season
      const activeSeason = await Season.findOne({ isActive: true });
      if (activeSeason) {
        seasonFilter.season = activeSeason._id;
      }
    }

    const teams = await Team.find(seasonFilter).populate('season');

    // Flatten all players from all teams
    const allPlayers = [];
    teams.forEach(team => {
      team.players.forEach(player => {
        allPlayers.push({
          playerId: player._id,
          playerName: player.name,
          count: player.count,
          teamId: team._id,
          teamName: team.teamName,
          season: team.season.year
        });
      });
    });

    // Sort by count descending
    const leaderboard = allPlayers.sort((a, b) => b.count - a.count);

    res.json({
      leaderboard,
      season: teams[0]?.season?.year ?? null
    });
  } catch (error) {
    console.error('Error fetching player leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all available seasons
router.get('/seasons', async (req, res) => {
  try {
    const seasons = await Season.find().sort({ year: -1 });

    res.json({
      seasons: seasons.map(s => ({
        year: s.year,
        startDate: s.startDate,
        endDate: s.endDate,
        isActive: s.isActive
      }))
    });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily stats for calendar
router.get('/daily-stats', async (req, res) => {
  try {
    // Get activities grouped by date (matching admin endpoint logic)
    const dailyStats = await Activity.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: '$count' },
          activities: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Format the results
    const formattedStats = dailyStats.map(stat => ({
      date: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}-${String(stat._id.day).padStart(2, '0')}`,
      treeCount: stat.count
    }));

    res.json({ dailyStats: formattedStats });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
