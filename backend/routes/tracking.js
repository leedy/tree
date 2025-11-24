import express from 'express';
import crypto from 'crypto';
import PageView from '../models/PageView.js';

const router = express.Router();

// Hash IP address for privacy
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

// Track page view (public endpoint)
router.post('/pageview', async (req, res) => {
  try {
    const { path, referrer } = req.body;

    // Get IP from various headers (for proxy support)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
               req.headers['x-real-ip'] ||
               req.ip ||
               req.connection.remoteAddress;

    const visitorId = hashIP(ip);
    const userAgent = req.headers['user-agent'];

    const pageView = new PageView({
      path,
      visitorId,
      userAgent,
      referrer: referrer || null
    });

    await pageView.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    // Don't fail the request if tracking fails
    res.status(200).json({ success: false });
  }
});

export default router;
