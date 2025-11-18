import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/teams.js';
import leaderboardRoutes from './routes/leaderboards.js';
import activitiesRoutes from './routes/activities.js';
import adminAuthRoutes from './routes/adminAuth.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Tree on a Truck API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the React app in production
// Check if dist folder exists (production build)
const distPath = path.join(__dirname, '../frontend/dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));

  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('Serving production build from /dist');
} else {
  console.log('No production build found. Run "npm run build" first or use separate frontend dev server.');

  // 404 handler for API-only mode
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🎄 Tree on a Truck API Server`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
