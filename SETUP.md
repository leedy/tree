# Tree on a Truck - Setup Guide

Complete setup instructions for getting the Tree on a Truck application running locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher)
  - Check version: `node --version`
  - Download from: https://nodejs.org/
- **npm** (comes with Node.js)
  - Check version: `npm --version`
- **MongoDB** (v5.0 or higher)
  - Can be local installation or remote server
  - MongoDB Atlas (cloud) also works

### MongoDB Options

#### Option 1: MongoDB Atlas (Recommended for beginners)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get your connection string

#### Option 2: Local MongoDB Installation
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Default runs on `localhost:27017`

#### Option 3: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/leedy/tree.git
cd tree
```

### 2. Project Structure

```
tree/
├── backend/              # Express API server
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   ├── .env.template    # Environment template
│   └── server.js        # Entry point
├── frontend/            # React web application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API service
│   ├── .env.template    # Environment template
│   └── vite.config.js   # Vite configuration
└── README.md
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- express - Web framework
- mongoose - MongoDB ODM
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing
- dotenv - Environment variable management

### 3. Configure Environment Variables

Create a `.env` file from the template:

```bash
cp .env.template .env
```

Edit the `.env` file with your settings:

```env
# MongoDB Configuration
MONGO_HOST=localhost           # Your MongoDB host
MONGO_PORT=27017              # MongoDB port (default: 27017)
MONGO_USERNAME=admin          # MongoDB username
MONGO_PASSWORD=your-password  # MongoDB password
MONGO_DATABASE=treeontruck    # Database name

# Server Configuration
PORT=3001                     # Backend server port

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your-very-secure-random-secret-key-change-this

# Game Season Configuration
SEASON_START_MONTH=11         # November (Black Friday)
SEASON_START_DAY=25           # Approximate Black Friday
SEASON_END_MONTH=12           # December
SEASON_END_DAY=24             # Christmas Eve
```

#### Important Notes:

**JWT_SECRET**:
- This MUST be changed to a secure random string
- Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit this to version control

**MongoDB Connection String**:
- For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/`
- For local MongoDB: `localhost` or `127.0.0.1`
- For Docker MongoDB: `localhost` (if running on host) or container name

### 4. Verify Backend Configuration

Test that MongoDB is accessible:

```bash
# For local MongoDB
mongosh "mongodb://localhost:27017"

# For MongoDB Atlas
mongosh "your-connection-string"
```

### 5. Start the Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

**Expected Output:**
```
MongoDB connected successfully
Database: treeontruck

🎄 Tree on a Truck API Server
📡 Server running on http://localhost:3001
🏥 Health check: http://localhost:3001/api/health
```

### 6. Test Backend API

Open a browser or use curl to test:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Tree on a Truck API is running",
  "timestamp": "2024-11-02T..."
}
```

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a **new terminal window** and navigate to the frontend:

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- react & react-dom - UI framework
- react-router-dom - Routing
- vite - Build tool and dev server

### 3. Configure Environment Variables

Create a `.env` file from the template:

```bash
cp .env.template .env
```

Edit the `.env` file:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:3001
```

**Notes:**
- If backend runs on a different port, update this URL
- For production, this would be your production API URL

### 4. Start the Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Tree on a Truck login page!

## Running the Application

### Starting Both Servers

You need **two terminal windows** running simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### First Time Use

1. **Register a Team**
   - Click "Register here" on the login page
   - Enter a team name (must be unique)
   - Enter a password (min 6 characters)
   - Click "Create Team"

2. **Add Team Members**
   - Click "Manage Team" button
   - Enter player names and click "Add"
   - Click "Done" when finished

3. **Start Tracking Trees**
   - Use the + buttons to increment counts when you spot a tree on a vehicle
   - Use the - buttons to decrement if you made a mistake

4. **View Leaderboards**
   - Click "Leaderboards" in the navigation
   - Switch between Team and Individual rankings
   - Filter by season (once you have multiple seasons)

## Troubleshooting

### Backend Issues

#### MongoDB Connection Failed

**Error:** `MongoDB connection error`

**Solutions:**
1. Verify MongoDB is running:
   ```bash
   # Check if MongoDB process is running
   ps aux | grep mongod

   # For MongoDB service
   sudo systemctl status mongod  # Linux
   brew services list            # macOS with Homebrew
   ```

2. Check connection string in `.env`
3. Verify username/password are correct
4. For MongoDB Atlas, check IP whitelist settings

#### Port Already in Use

**Error:** `Port 3001 is already in use`

**Solutions:**
1. Stop the other process using port 3001:
   ```bash
   # Find process
   lsof -i :3001

   # Kill process
   kill -9 <PID>
   ```

2. Or change the port in `backend/.env`:
   ```env
   PORT=3002
   ```

#### JWT Token Errors

**Error:** `Invalid or expired token`

**Solutions:**
1. Clear browser localStorage
2. Log out and log back in
3. Verify `JWT_SECRET` is set in `.env`

### Frontend Issues

#### Cannot Connect to Backend

**Error:** Network errors or "Failed to fetch"

**Solutions:**
1. Verify backend is running on port 3001
2. Check `VITE_API_URL` in `frontend/.env`
3. Check browser console for CORS errors
4. Verify backend CORS is enabled (it should be by default)

#### White Screen / No Content

**Solutions:**
1. Check browser console for errors
2. Clear browser cache
3. Verify all dependencies installed: `npm install`
4. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### Vite Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:** The dev server will automatically try the next available port (5174, 5175, etc.)

### Common Issues

#### Changes Not Showing

**Frontend:**
- Vite has hot reload - changes should appear automatically
- Try hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

**Backend:**
- Using `npm run dev` enables auto-reload with `--watch` flag
- If not working, restart the server manually

#### Database Not Persisting Data

**Solution:**
1. Check MongoDB is running
2. Verify database name in connection string
3. Check MongoDB logs for errors

#### Login Not Working

**Solutions:**
1. Verify backend is running and healthy
2. Check Network tab in browser DevTools
3. Verify password meets minimum length (6 characters)
4. Check backend logs for errors

## Next Steps

After successful setup:

1. **Create Test Data**
   - Register multiple teams
   - Add players to each team
   - Increment some counts

2. **Explore Features**
   - Test the leaderboards
   - Try editing player names
   - Test the logout/login flow

3. **Mobile Testing**
   - Open on your phone's browser: `http://your-local-ip:5173`
   - Test the touch-friendly interface
   - Verify responsive design

4. **Production Deployment** (see DEPLOYMENT.md - coming soon)

## Development Tips

### Useful Commands

**Backend:**
```bash
# Watch mode (auto-restart on changes)
npm run dev

# Regular start
npm start

# Check logs
# Logs appear in terminal where server is running
```

**Frontend:**
```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Management

**View data in MongoDB:**
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/treeontruck"

# List all teams
db.teams.find().pretty()

# List all seasons
db.seasons.find().pretty()

# Count teams
db.teams.countDocuments()

# Delete all data (careful!)
db.teams.deleteMany({})
db.seasons.deleteMany({})
```

### API Testing

Use curl or tools like Postman to test API endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Register team
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"teamName":"TestTeam","password":"password123"}'

# Get leaderboards
curl http://localhost:3001/api/leaderboards/teams
```

## Support

For issues or questions:
- Check this documentation
- Review the main README.md
- Check the API documentation (API.md)
- Open an issue on GitHub: https://github.com/leedy/tree/issues

## Security Notes

- Never commit `.env` files to version control
- Change `JWT_SECRET` to a secure random value
- Use strong passwords for MongoDB
- For production, use environment-specific configuration
- Enable MongoDB authentication in production
- Use HTTPS in production
