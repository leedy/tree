import express from 'express';
import Activity from '../models/Activity.js';
import Season from '../models/Season.js';

const router = express.Router();

// Get recent activities
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20, season: seasonYear } = req.query;

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

    const activities = await Activity.find(seasonFilter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      activities,
      count: activities.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
