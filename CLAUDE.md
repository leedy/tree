# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tree on a Truck** - A Christmas game where teams compete to spot the most Christmas trees on vehicles. Runs from Black Friday to Christmas Eve each year. Teams track individual player scores using an honor system.

## Architecture

Full-stack application with separate frontend and backend:

```
tree/
├── backend/              # Express.js API server (port 3002)
│   ├── config/          # MongoDB connection
│   ├── models/          # Mongoose schemas
│   │   ├── Team.js      # Team with players and scores
│   │   ├── Season.js    # Season definitions
│   │   ├── Activity.js  # Activity log
│   │   └── Admin.js     # Admin accounts
│   ├── routes/          # API endpoints
│   │   ├── auth.js      # Team authentication
│   │   ├── teams.js     # Team/player management
│   │   ├── leaderboards.js  # Rankings
│   │   ├── activities.js    # Activity feed
│   │   ├── adminAuth.js     # Admin login
│   │   └── admin.js     # Admin operations
│   ├── middleware/      # Auth middleware
│   ├── scripts/         # Utility scripts
│   │   └── createAdmin.js
│   ├── server.js        # Entry point
│   └── .env             # Backend config (REQUIRED)
├── frontend/            # React + Vite (port 5174)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   └── ChristmasCountdown.jsx
│   │   ├── pages/       # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leaderboards.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/    # API service layer
│   │   │   └── api.js
│   │   └── App.jsx      # Main router
│   ├── vite.config.js   # Dev server + proxy config
│   └── .env             # Frontend config
├── ecosystem.config.cjs # PM2 production config
└── logs/                # Application logs
```

**Technology Stack:**
- Frontend: React 18, React Router 6, Vite 5
- Backend: Express, Node.js (ES modules)
- Database: MongoDB (remote at 192.168.1.100:27017)
- Auth: JWT tokens (team auth + separate admin auth)
- Production: PM2 process manager

## Development Commands

### Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev  # Uses node --watch for auto-restart

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5174
Backend: http://localhost:3002

### Production Build & Deploy

```bash
# Build frontend
cd frontend
npm run build

# Preview production build locally
npm run preview  # http://localhost:4173

# Deploy with PM2
cd /home/leedy/tree
pm2 start ecosystem.config.cjs
pm2 logs tree-backend
```

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Environment Configuration

### Backend (.env in backend/)

```bash
cd backend
cp .env.template .env
# Edit with your values
```

Required variables:
```env
MONGO_HOST=192.168.1.100
MONGO_PORT=27017
MONGO_USERNAME=tree_user
MONGO_PASSWORD=your_password
MONGO_DATABASE=treeonatruck

PORT=3002

JWT_SECRET=your_secure_secret

# Season dates (Black Friday to Christmas Eve)
SEASON_START_MONTH=11
SEASON_START_DAY=25
SEASON_END_MONTH=12
SEASON_END_DAY=24
```

### Frontend (.env in frontend/)

```bash
cd frontend
cp .env.template .env
# Edit with your backend URL
```

Required variables:
```env
VITE_API_URL=http://localhost:3002
# For production: http://YOUR_PI_IP:3002
```

**IMPORTANT:** Use actual IP address for production, NOT localhost. Do NOT add `/api` suffix.

## MongoDB Connection

**CRITICAL**: This app connects to a **remote MongoDB server** at 192.168.1.100 (not localhost).

- MongoDB must be running on the network before starting the app
- Connection configured in `backend/.env`
- Database name: `treeonatruck`
- The app does NOT start or manage MongoDB

**Collections:**
- `teams` - Team accounts with players array and scores
- `seasons` - Season definitions (year, start date, end date, active status)
- `activities` - Activity log of tree sightings (who, when, action)
- `admins` - Admin user accounts (separate from teams)

## Key Architecture Patterns

### Authentication Model

**Team Authentication:**
- One email + password per team (NOT per player)
- Team leader manages all team members
- JWT token stored in localStorage
- Token expires in 30 days

**Admin Authentication:**
- Completely separate from team auth
- Admin accounts created via `createAdmin.js` script
- JWT token expires in 7 days
- Admin routes protected by admin middleware

### Data Flow

1. Frontend makes requests to `/api/*`
2. Vite dev server proxies to `localhost:3002` (see `vite.config.js`)
3. Backend handles requests:
   - Team/player management
   - Score tracking (increment/decrement)
   - Leaderboard generation
   - Activity logging
   - Season management
   - Admin operations

### Service Layer Pattern

Frontend uses service layer in `src/services/api.js`:
- Centralized axios instance
- Automatic JWT token attachment
- Consistent error handling
- Makes backend changes easier

### Backend Routes

**Public Routes:**
- `POST /api/auth/register` - Register new team (teamName, email, password)
- `POST /api/auth/login` - Team login (email, password)
- `GET /api/leaderboards/teams` - Team leaderboard
- `GET /api/leaderboards/players` - Player leaderboard
- `GET /api/leaderboards/seasons` - All seasons
- `GET /api/activities` - Recent activity feed

**Protected Team Routes** (require team JWT):
- `GET /api/teams/me` - Current team details
- `POST /api/teams/players` - Add player
- `PUT /api/teams/players/:playerId` - Update player name
- `DELETE /api/teams/players/:playerId` - Delete player
- `POST /api/teams/players/:playerId/increment` - Increment player count
- `POST /api/teams/players/:playerId/decrement` - Decrement player count

**Admin Routes** (require admin JWT):
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/stats` - Overview statistics
- `GET /api/admin/teams` - List all teams
- `PUT /api/admin/teams/:id` - Update team
- `DELETE /api/admin/teams/:id` - Delete team
- `GET /api/admin/seasons` - List seasons
- `POST /api/admin/seasons` - Create season
- `PUT /api/admin/seasons/:id` - Update season
- `DELETE /api/admin/seasons/:id` - Delete season
- `GET /api/admin/activities` - List activities (paginated)
- `DELETE /api/admin/activities/:id` - Delete activity

### Database Schemas

**Team Model:**
```javascript
{
  teamName: String,
  email: String (unique),
  password: String (hashed),
  players: [{
    name: String,
    count: Number (default: 0),
    createdAt: Date
  }],
  seasonId: ObjectId (ref: Season),
  createdAt: Date
}
```

**Season Model:**
```javascript
{
  year: Number,
  startDate: Date,
  endDate: Date,
  isActive: Boolean (default: false)
}
```

**Activity Model:**
```javascript
{
  teamId: ObjectId,
  teamName: String,
  playerId: ObjectId,
  playerName: String,
  action: String ('increment' or 'decrement'),
  timestamp: Date
}
```

## Admin System

### Create Admin Account

```bash
cd backend
node scripts/createAdmin.js
```

Prompts for:
- Username (min 3 characters)
- Email address
- Password (min 6 characters)

### Access Admin Panel

**Development:** http://localhost:5174/admin/login
**Production:** http://YOUR_PI_IP:4173/admin/login

### Admin Features

**Overview Tab:**
- Total teams, players, trees, activities
- Active season information
- Overall statistics

**Teams Tab:**
- View all teams with stats
- Edit team details (name, email)
- ⭐ Add email addresses to teams created before email requirement
- Delete teams (removes all data)

**Seasons Tab:**
- Create new seasons
- Edit season dates and year
- Set active season
- Delete unused seasons

**Activities Tab:**
- View recent activity log (last 100)
- See who added/removed trees and when
- Delete inappropriate activities

### Common Admin Tasks

**Adding email to existing team:**
1. Go to Teams tab
2. Click "Edit" on team
3. Enter email address
4. Click "Save"

**Starting new season:**
1. Go to Seasons tab
2. Click "Create Season"
3. Enter year, dates
4. Check "Active Season"
5. Click "Save"

## Production Deployment with PM2

```bash
# Build frontend
cd frontend
npm run build

# Start with PM2
cd /home/leedy/tree
pm2 start ecosystem.config.cjs

# Manage
pm2 status
pm2 logs tree-backend
pm2 restart tree-backend
pm2 stop tree-backend

# Save PM2 config
pm2 save

# Auto-start on boot
pm2 startup
```

In production, backend serves the built frontend from `dist/` folder. No separate frontend server needed.

## Game Features

**Current Features:**
- Team registration and authentication
- Simple login (one email + password per team)
- Team leader manages all team members
- Add/edit/delete team members
- Increment/decrement player counts
- Real-time team and individual leaderboards
- Season tracking (Black Friday to Christmas Eve)
- Historical data preservation
- Activity feed showing recent tree sightings
- Admin panel for management
- Mobile-first responsive design
- Touch-friendly UI with large buttons

**Season System:**
- Seasons run from Black Friday (Nov 25) to Christmas Eve (Dec 24)
- Only one active season at a time
- Teams can view historical seasons on leaderboard page
- New teams automatically join the active season
- Admins can create and manage seasons

## Common Development Tasks

### Add a New Page

1. Create page component in `frontend/src/pages/NewPage.jsx`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link if needed

### Add a New API Endpoint

1. Add route handler in appropriate file in `backend/routes/`
2. If new route file, import and register in `backend/server.js`
3. Update frontend service layer in `frontend/src/services/api.js`

### Update Database Schema

1. Edit model in `backend/models/`
2. Restart backend server
3. MongoDB updates schema automatically (schemaless)
4. For data migrations, create script in `backend/scripts/`

### Debug Backend Issues

- Check backend terminal for errors
- Verify `.env` exists with correct values
- Test MongoDB connection: `mongosh mongodb://user:pass@192.168.1.100:27017/treeonatruck`
- Check PM2 logs: `pm2 logs tree-backend`

### Debug Frontend Issues

- Check browser console
- Verify backend is running on port 3002
- Check Network tab - `/api` requests should be proxied
- Clear localStorage if auth is broken: `localStorage.clear()`

### Debug Auth Issues

- Check JWT token in localStorage: `localStorage.getItem('token')`
- Verify token in backend middleware
- Check that JWT_SECRET matches between sessions
- Ensure token hasn't expired (30 days for teams, 7 days for admins)

## Common Gotchas

1. **Missing .env files**: Copy from templates in both `backend/` and `frontend/`
2. **MongoDB unreachable**: Ensure server at 192.168.1.100 is running and accessible
3. **Wrong port**: Backend must be on 3002 (check `backend/.env` and `frontend/vite.config.js`)
4. **Frontend can't reach backend**: Ensure `VITE_API_URL` uses actual IP for production (not localhost)
5. **PM2 not restarting**: Use `pm2 restart tree-backend` after code changes
6. **Stale production build**: Run `npm run build` after frontend changes
7. **Admin vs team auth**: Admin and team authentication are completely separate systems
8. **Season issues**: Only one season can be active at a time
9. **ES modules**: Backend uses ES modules (`import`/`export`), not CommonJS (`require`)

## Project Documentation

Additional documentation in repository:
- `README.md` - Full project documentation
- `RASPBERRY_PI_SETUP.md` - Raspberry Pi deployment guide
- `SETUP.md` - Detailed setup instructions
- `DEPLOYMENT.md` - Production deployment guide
- `API.md` - Complete API documentation
- `PROJECT.md` - Project planning and features
- `PM2-CONFIG.md` - PM2 configuration details
