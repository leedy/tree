import express from 'express';
import Update from '../models/Update.js';

const router = express.Router();

// Get active updates (public route)
router.get('/active', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const updates = await Update.getActiveUpdates(limit);

    res.json({
      updates: updates.map(update => ({
        id: update._id,
        title: update.title,
        message: update.message,
        type: update.type,
        isPinned: update.isPinned,
        publishDate: update.publishDate
      }))
    });
  } catch (error) {
    console.error('Error fetching active updates:', error);
    res.status(500).json({ message: 'Server error fetching updates' });
  }
});

// Get all updates (public route)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const updates = await Update.find({ isActive: true })
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit);

    res.json({
      updates: updates.map(update => ({
        id: update._id,
        title: update.title,
        message: update.message,
        type: update.type,
        isPinned: update.isPinned,
        publishDate: update.publishDate,
        expiryDate: update.expiryDate
      }))
    });
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Server error fetching updates' });
  }
});

export default router;
