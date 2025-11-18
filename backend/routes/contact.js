import express from 'express';
import { sendContactEmail } from '../services/emailService.js';

const router = express.Router();

// POST /api/contact - Send contact form email
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'All fields are required (name, email, message)'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        error: 'Message must be at least 10 characters long'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message must be less than 2000 characters'
      });
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.error('Email not configured. Please set EMAIL_USER, EMAIL_PASS, and EMAIL_TO in .env');
      return res.status(503).json({
        error: 'Email service is not configured. Please contact the administrator.'
      });
    }

    // Send email
    await sendContactEmail({ name, email, message });

    res.status(200).json({
      message: 'Your message has been sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      error: 'Failed to send message. Please try again later.'
    });
  }
});

export default router;
