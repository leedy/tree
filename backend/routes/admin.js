import express from 'express';
import Team from '../models/Team.js';
import Season from '../models/Season.js';
import Activity from '../models/Activity.js';
import PageView from '../models/PageView.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// ============ TEAM MANAGEMENT ============

// Get all teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('season')
      .sort({ createdAt: -1 });

    const teamsWithCount = teams.map(team => ({
      id: team._id,
      teamName: team.teamName,
      email: team.email,
      season: team.season.year,
      totalCount: team.getTotalCount(),
      playerCount: team.players.length,
      createdAt: team.createdAt
    }));

    res.json({ teams: teamsWithCount });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error fetching teams' });
  }
});

// Get single team with full details
router.get('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('season');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        season: team.season,
        players: team.players,
        totalCount: team.getTotalCount(),
        createdAt: team.createdAt,
        updatedAt: team.updatedAt
      }
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error fetching team' });
  }
});

// Update team
router.put('/teams/:id', async (req, res) => {
  try {
    const { teamName, email } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if new team name already exists (if changing)
    if (teamName && teamName !== team.teamName) {
      const existingTeam = await Team.findOne({ teamName });
      if (existingTeam) {
        return res.status(409).json({ message: 'Team name already exists' });
      }
      team.teamName = teamName;
    }

    // Check if new email already exists (if changing)
    if (email && email !== team.email) {
      const existingEmail = await Team.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      team.email = email.toLowerCase();
    }

    await team.save();
    await team.populate('season');

    res.json({
      message: 'Team updated successfully',
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        season: team.season,
        players: team.players,
        totalCount: team.getTotalCount()
      }
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error updating team' });
  }
});

// Delete team
router.delete('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Delete all activities associated with this team
    await Activity.deleteMany({ team: team._id });

    await Team.findByIdAndDelete(req.params.id);

    res.json({ message: 'Team and associated activities deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Server error deleting team' });
  }
});

// Delete player from team
router.delete('/teams/:teamId/players/:playerId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const playerIndex = team.players.findIndex(
      p => p._id.toString() === req.params.playerId
    );

    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Player not found' });
    }

    team.players.splice(playerIndex, 1);
    await team.save();

    // Delete activities for this player
    await Activity.deleteMany({
      team: team._id,
      player: req.params.playerId
    });

    res.json({
      message: 'Player and associated activities deleted successfully',
      team: {
        id: team._id,
        players: team.players,
        totalCount: team.getTotalCount()
      }
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({ message: 'Server error deleting player' });
  }
});

// ============ SEASON MANAGEMENT ============

// Get all seasons
router.get('/seasons', async (req, res) => {
  try {
    const seasons = await Season.find().sort({ year: -1 });
    res.json({ seasons });
  } catch (error) {
    console.error('Get seasons error:', error);
    res.status(500).json({ message: 'Server error fetching seasons' });
  }
});

// Create season
router.post('/seasons', async (req, res) => {
  try {
    const { year, startDate, endDate, isActive, allowAddingTrees } = req.body;

    if (!year || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Year, start date, and end date are required'
      });
    }

    // If setting this season as active, deactivate all others
    if (isActive) {
      await Season.updateMany({}, { isActive: false });
    }

    const season = await Season.create({
      year,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive || false,
      allowAddingTrees: allowAddingTrees !== undefined ? allowAddingTrees : true
    });

    res.status(201).json({
      message: 'Season created successfully',
      season
    });
  } catch (error) {
    console.error('Create season error:', error);
    res.status(500).json({ message: 'Server error creating season' });
  }
});

// Update season
router.put('/seasons/:id', async (req, res) => {
  try {
    const { year, startDate, endDate, isActive, allowAddingTrees } = req.body;
    const season = await Season.findById(req.params.id);

    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    // If setting this season as active, deactivate all others
    if (isActive && !season.isActive) {
      await Season.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    if (year !== undefined) season.year = year;
    if (startDate !== undefined) season.startDate = new Date(startDate);
    if (endDate !== undefined) season.endDate = new Date(endDate);
    if (isActive !== undefined) season.isActive = isActive;
    if (allowAddingTrees !== undefined) season.allowAddingTrees = allowAddingTrees;

    await season.save();

    res.json({
      message: 'Season updated successfully',
      season
    });
  } catch (error) {
    console.error('Update season error:', error);
    res.status(500).json({ message: 'Server error updating season' });
  }
});

// Delete season
router.delete('/seasons/:id', async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);

    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    // Check if any teams are using this season
    const teamsCount = await Team.countDocuments({ season: req.params.id });
    if (teamsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete season - ${teamsCount} team(s) are using it`
      });
    }

    await Season.findByIdAndDelete(req.params.id);

    res.json({ message: 'Season deleted successfully' });
  } catch (error) {
    console.error('Delete season error:', error);
    res.status(500).json({ message: 'Server error deleting season' });
  }
});

// ============ ACTIVITY MANAGEMENT ============

// Get all activities (with pagination)
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Activity.countDocuments();

    res.json({
      activities,
      total,
      limit,
      skip
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
});

// Delete activity
router.delete('/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
});

// Get daily tree counts for calendar
router.get('/daily-stats', async (req, res) => {
  try {
    const { year, seasonId } = req.query;

    // Build query filter
    const matchFilter = {};

    if (seasonId) {
      matchFilter.season = seasonId;
    }

    // Get activities grouped by date
    const dailyStats = await Activity.aggregate([
      { $match: matchFilter },
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
      year: stat._id.year,
      month: stat._id.month,
      day: stat._id.day,
      treeCount: stat.count,
      activityCount: stat.activities
    }));

    res.json({ dailyStats: formattedStats });
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({ message: 'Server error fetching daily stats' });
  }
});

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalSeasons = await Season.countDocuments();
    const activeSeason = await Season.findOne({ isActive: true });

    // Get total trees counted across all teams
    const teams = await Team.find();
    const totalTrees = teams.reduce((sum, team) => sum + team.getTotalCount(), 0);

    // Get total players
    const totalPlayers = teams.reduce((sum, team) => sum + team.players.length, 0);

    res.json({
      stats: {
        totalTeams,
        totalPlayers,
        totalTrees,
        totalActivities,
        totalSeasons,
        activeSeason: activeSeason ? {
          year: activeSeason.year,
          startDate: activeSeason.startDate,
          endDate: activeSeason.endDate,
          allowAddingTrees: activeSeason.allowAddingTrees
        } : null
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// ============ ANALYTICS ============

// Get analytics overview
router.get('/analytics/overview', async (req, res) => {
  try {
    const totalViews = await PageView.countDocuments();
    const uniqueVisitors = await PageView.distinct('visitorId').then(ids => ids.length);

    // Get views from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const viewsLast24h = await PageView.countDocuments({
      timestamp: { $gte: yesterday }
    });

    // Get views from last 7 days
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const viewsLast7Days = await PageView.countDocuments({
      timestamp: { $gte: lastWeek }
    });

    res.json({
      analytics: {
        totalViews,
        uniqueVisitors,
        viewsLast24h,
        viewsLast7Days
      }
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ message: 'Server error fetching analytics overview' });
  }
});

// Get page views by path
router.get('/analytics/pages', async (req, res) => {
  try {
    const pageStats = await PageView.aggregate([
      {
        $group: {
          _id: '$path',
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          path: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          _id: 0
        }
      },
      { $sort: { views: -1 } }
    ]);

    res.json({ pages: pageStats });
  } catch (error) {
    console.error('Get page stats error:', error);
    res.status(500).json({ message: 'Server error fetching page stats' });
  }
});

// Get daily analytics
router.get('/analytics/daily', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dailyStats = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({ dailyStats });
  } catch (error) {
    console.error('Get daily analytics error:', error);
    res.status(500).json({ message: 'Server error fetching daily analytics' });
  }
});

// Get recent page views
router.get('/analytics/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const recentViews = await PageView.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('path visitorId timestamp -_id');

    res.json({ recentViews });
  } catch (error) {
    console.error('Get recent views error:', error);
    res.status(500).json({ message: 'Server error fetching recent views' });
  }
});

export default router;
