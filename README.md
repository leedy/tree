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

## Setup Instructions

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

### Backend (.env)

```env
MONGO_HOST=your-mongodb-host
MONGO_PORT=27017
MONGO_USERNAME=your-username
MONGO_PASSWORD=your-password
MONGO_DATABASE=treeontruck
PORT=3001
JWT_SECRET=your-secure-secret-key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new team
- `POST /api/auth/login` - Login as a team

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
- ✅ Team registration and authentication (JWT-based)
- ✅ Simple login (one team name + password per team)
- ✅ Team leader manages all team members
- ✅ Add/edit/delete team members
- ✅ Increment/decrement player counts
- ✅ Real-time team and individual leaderboards
- ✅ Season tracking (Black Friday to Christmas Eve)
- ✅ Historical data preservation
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
