# Tree on a Truck 🎄

A Christmas game where teams compete to spot the most Christmas trees on vehicles!

## Game Overview

- Season runs from Black Friday to Christmas Eve
- Teams track individual player scores
- Players increment their count when they spot a Christmas tree on a vehicle
- Honor system - no validation required
- Leaderboards for both teams and individual players
- Historical season data preservation

## Project Structure

```
tree/
├── backend/              # Express API server
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas (Team, Season)
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Entry point
├── frontend/            # React web application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB server (accessible locally or remotely)
- npm or yarn

## Quick Start

### Raspberry Pi Deployment (Recommended for Production)

**For complete Raspberry Pi setup with systemd services and auto-start:**

📖 **See [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md)** for the full guide

This is the recommended way to run Tree on a Truck in production on your home network.

### Local Development Setup

For development on your laptop/desktop:

### 1. Clone the Repository

```bash
git clone https://github.com/leedy/tree.git
cd tree
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template and configure
cp .env.template .env
# Edit .env with your MongoDB credentials and settings

# Start the backend server
npm run dev
```

The backend server will start on **http://localhost:3001**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template (optional - defaults to localhost:3001)
cp .env.template .env

# Start the frontend development server
npm run dev
```

The frontend will be available at **http://localhost:5173**

## Environment Variables

Both backend and frontend require `.env` files. Templates are provided.

### Backend (.env)

**Location:** `backend/.env`

```bash
cd backend
cp .env.template .env
nano .env  # Edit with your values
```

**Configuration:**
```env
# MongoDB Configuration
MONGO_HOST=your-mongodb-host          # IP or hostname
MONGO_PORT=27017
MONGO_USERNAME=your-username          # Leave empty if no auth
MONGO_PASSWORD=your-password          # Leave empty if no auth
MONGO_DATABASE=treeonatruck

# Server Configuration
PORT=3001                             # Use 3002 if 3001 is taken

# JWT Secret (IMPORTANT: Change in production!)
JWT_SECRET=your-secure-secret-key

# Season dates (Black Friday to Christmas Eve)
SEASON_START_MONTH=11
SEASON_START_DAY=25
SEASON_END_MONTH=12
SEASON_END_DAY=24
```

### Frontend (.env)

**Location:** `frontend/.env`

```bash
cd frontend
cp .env.template .env
nano .env  # Edit with your values
```

**For local development:**
```env
VITE_API_URL=http://localhost:3001
```

**For Raspberry Pi deployment:**
```env
VITE_API_URL=http://YOUR_PI_IP:3002
```

**IMPORTANT:**
- Do NOT use `localhost` for Pi deployment - use actual IP
- Do NOT add `/api` at the end (it's added automatically)
- Must match the PORT in backend .env

## Admin System

Tree on a Truck includes a comprehensive admin panel for managing teams, seasons, and activities.

### Creating an Admin Account

**First time setup:**

```bash
cd backend
node scripts/createAdmin.js
```

You'll be prompted to enter:
- Admin username (minimum 3 characters)
- Admin email address
- Admin password (minimum 6 characters)

The script will create your admin account and you can then login at `/admin/login`.

### Accessing the Admin Panel

**Development:** http://localhost:5173/admin/login
**Production:** http://YOUR_PI_IP:4173/admin/login

Login with the username and password you created.

### Admin Features

The admin dashboard provides four main sections:

#### 1. Overview
- View total statistics (teams, players, trees, activities)
- See active season information
- Monitor overall app usage

#### 2. Team Management
- View all registered teams with their stats
- **Edit team details** (team name and email address)
  - ⭐ **Critical for fixing existing teams:** Add email addresses to teams that were created before the email requirement
- Delete teams (removes all associated data and activities)
- View player counts and tree totals per team

#### 3. Season Management
- Create new seasons with custom date ranges
- Edit existing seasons (dates, year)
- Set which season is currently active
- Delete unused seasons (cannot delete if teams are using it)
- View season details (start date, end date, active status)

#### 4. Activity Management
- View recent activity log (last 100 activities)
- See who added/removed trees and when
- Delete inappropriate or spam activities
- Monitor team activity in real-time

### Admin Use Cases

**Common admin tasks:**

1. **Adding emails to existing teams:**
   - Go to Teams tab
   - Click "Edit" on team missing email
   - Enter their email address
   - Click "Save"
   - Team can now login with email + password

2. **Starting a new season:**
   - Go to Seasons tab
   - Click "Create Season"
   - Enter year, start date, end date
   - Check "Active Season" to make it current
   - Click "Save"

3. **Removing spam/test data:**
   - Go to Activities tab
   - Find test activities
   - Click "Delete" on each one

4. **Emergency team deletion:**
   - Go to Teams tab
   - Click "Delete" on team
   - Confirm (this removes ALL team data)

### Admin Security

- Admin authentication is completely separate from team authentication
- Admin tokens expire after 7 days (vs 30 days for teams)
- Admin routes are protected by middleware that verifies admin status
- Admin passwords are hashed with bcrypt before storage

### Admin API Endpoints

All admin endpoints require admin authentication token:

**Authentication:**
- `POST /api/admin/auth/login` - Admin login

**Team Management:**
- `GET /api/admin/teams` - List all teams
- `GET /api/admin/teams/:id` - Get team details
- `PUT /api/admin/teams/:id` - Update team
- `DELETE /api/admin/teams/:id` - Delete team
- `DELETE /api/admin/teams/:teamId/players/:playerId` - Delete player

**Season Management:**
- `GET /api/admin/seasons` - List all seasons
- `POST /api/admin/seasons` - Create season
- `PUT /api/admin/seasons/:id` - Update season
- `DELETE /api/admin/seasons/:id` - Delete season

**Activity Management:**
- `GET /api/admin/activities` - List activities (paginated)
- `DELETE /api/admin/activities/:id` - Delete activity

**Statistics:**
- `GET /api/admin/stats` - Get overview statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new team (requires: teamName, email, password)
- `POST /api/auth/login` - Login as a team (requires: email, password)

### Team Management
- `GET /api/teams/me` - Get current team details
- `POST /api/teams/players` - Add a player
- `PUT /api/teams/players/:playerId` - Update player name
- `DELETE /api/teams/players/:playerId` - Delete a player
- `POST /api/teams/players/:playerId/increment` - Increment player count
- `POST /api/teams/players/:playerId/decrement` - Decrement player count

### Leaderboards
- `GET /api/leaderboards/teams` - Get team leaderboard
- `GET /api/leaderboards/players` - Get individual player leaderboard
- `GET /api/leaderboards/seasons` - Get all seasons

## Features

### Current Features
- ✅ Team registration and authentication (JWT-based, email + password)
- ✅ Simple login (one email + password per team)
- ✅ Team leader manages all team members
- ✅ Add/edit/delete team members
- ✅ Increment/decrement player counts
- ✅ Real-time team and individual leaderboards
- ✅ Season tracking (Black Friday to Christmas Eve)
- ✅ Historical data preservation
- ✅ Activity feed showing recent tree sightings
- ✅ **Admin panel** for managing teams, seasons, and activities
- ✅ Mobile-first responsive design
- ✅ Touch-friendly UI with large buttons

### Future Enhancements
- 📱 iOS native app
- 📸 Photo upload for tree sightings
- 💬 Team chat/activity feed
- 🔔 Push notifications
- 🎯 Individual player logins
- 🏆 Achievements and badges

## Tech Stack

- **Frontend**: React, React Router, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with mobile-first approach

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses node --watch for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## Contributing

This is a personal/family project, but feel free to fork and adapt for your own use!

## License

ISC
