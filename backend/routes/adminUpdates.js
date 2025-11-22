import express from 'express';
import Update from '../models/Update.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Get all updates (admin view - includes inactive)
router.get('/', async (req, res) => {
  try {
    const updates = await Update.find()
      .populate('createdBy', 'username email')
      .sort({ isPinned: -1, publishDate: -1 });

    res.json({
      updates: updates.map(update => ({
        id: update._id,
        title: update.title,
        message: update.message,
        type: update.type,
        isPinned: update.isPinned,
        publishDate: update.publishDate,
        expiryDate: update.expiryDate,
        isActive: update.isActive,
        createdBy: update.createdBy,
        createdAt: update.createdAt,
        updatedAt: update.updatedAt
      }))
    });
  } catch (error) {
    console.error('Admin get updates error:', error);
    res.status(500).json({ message: 'Server error fetching updates' });
  }
});

// Get single update
router.get('/:id', async (req, res) => {
  try {
    const update = await Update.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json({
      update: {
        id: update._id,
        title: update.title,
        message: update.message,
        type: update.type,
        isPinned: update.isPinned,
        publishDate: update.publishDate,
        expiryDate: update.expiryDate,
        isActive: update.isActive,
        createdBy: update.createdBy,
        createdAt: update.createdAt,
        updatedAt: update.updatedAt
      }
    });
  } catch (error) {
    console.error('Admin get update error:', error);
    res.status(500).json({ message: 'Server error fetching update' });
  }
});

// Create new update
router.post('/', async (req, res) => {
  try {
    const { title, message, type, isPinned, publishDate, expiryDate, isActive } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ message: 'Title must be 200 characters or less' });
    }

    // Create update
    const update = await Update.create({
      title: title.trim(),
      message: message.trim(),
      type: type || 'info',
      isPinned: isPinned || false,
      publishDate: publishDate || Date.now(),
      expiryDate: expiryDate || null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.admin._id
    });

    const populatedUpdate = await Update.findById(update._id)
      .populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Update created successfully',
      update: {
        id: populatedUpdate._id,
        title: populatedUpdate.title,
        message: populatedUpdate.message,
        type: populatedUpdate.type,
        isPinned: populatedUpdate.isPinned,
        publishDate: populatedUpdate.publishDate,
        expiryDate: populatedUpdate.expiryDate,
        isActive: populatedUpdate.isActive,
        createdBy: populatedUpdate.createdBy,
        createdAt: populatedUpdate.createdAt,
        updatedAt: populatedUpdate.updatedAt
      }
    });
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({ message: 'Server error creating update' });
  }
});

// Update existing update
router.put('/:id', async (req, res) => {
  try {
    const { title, message, type, isPinned, publishDate, expiryDate, isActive } = req.body;

    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    // Validation
    if (title && title.length > 200) {
      return res.status(400).json({ message: 'Title must be 200 characters or less' });
    }

    // Update fields
    if (title !== undefined) update.title = title.trim();
    if (message !== undefined) update.message = message.trim();
    if (type !== undefined) update.type = type;
    if (isPinned !== undefined) update.isPinned = isPinned;
    if (publishDate !== undefined) update.publishDate = publishDate;
    if (expiryDate !== undefined) update.expiryDate = expiryDate;
    if (isActive !== undefined) update.isActive = isActive;

    await update.save();

    const populatedUpdate = await Update.findById(update._id)
      .populate('createdBy', 'username email');

    res.json({
      message: 'Update updated successfully',
      update: {
        id: populatedUpdate._id,
        title: populatedUpdate.title,
        message: populatedUpdate.message,
        type: populatedUpdate.type,
        isPinned: populatedUpdate.isPinned,
        publishDate: populatedUpdate.publishDate,
        expiryDate: populatedUpdate.expiryDate,
        isActive: populatedUpdate.isActive,
        createdBy: populatedUpdate.createdBy,
        createdAt: populatedUpdate.createdAt,
        updatedAt: populatedUpdate.updatedAt
      }
    });
  } catch (error) {
    console.error('Update update error:', error);
    res.status(500).json({ message: 'Server error updating update' });
  }
});

// Delete update
router.delete('/:id', async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    await Update.findByIdAndDelete(req.params.id);

    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({ message: 'Server error deleting update' });
  }
});

export default router;
