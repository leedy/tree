# Tree on a Truck - Project Documentation

## Project Overview

**Tree on a Truck** is a festive family game where players compete to spot the most Christmas trees on vehicles during the holiday season. This web application allows families to track their sightings, compete with other teams, and view leaderboards in real-time.

### The Game

**Objective:** Spot and count Christmas trees on vehicles (trucks, cars, etc.) between Black Friday and Christmas Eve.

**How It Works:**
1. A team leader creates a team account
2. Family members are added to the team
3. Whenever someone spots a tree on a vehicle, they call it out
4. The team leader increments that player's count
5. Teams compete for the highest total score
6. Individual players compete for the highest personal score

**Honor System:** The game runs on trust - no verification or validation is required. It's all about family fun!

### Target Audience

- Families looking for holiday fun
- Groups of friends
- Anyone who enjoys friendly competition
- People who want to make holiday travel more engaging

### Season Timeline

- **Start:** Black Friday (approx. November 25)
- **End:** Christmas Eve (December 24)
- **Duration:** ~1 month of gameplay
- **Historical Data:** All previous seasons are preserved

---

## Project Goals

### Primary Goals

1. **Simple & Accessible**
   - Easy registration process
   - Intuitive interface
   - Mobile-first design
   - No complicated features

2. **Family-Friendly**
   - One account per family team
   - Team leader manages all players
   - Quick to increment counts
   - Fun competition without pressure

3. **Reliable**
   - Data persistence across seasons
   - No data loss
   - Simple backup/restore

4. **Scalable**
   - Support multiple teams
   - Handle concurrent updates
   - Preserve historical data

### Future Goals

- **Mobile App:** Native iOS app for easier mobile use
- **Photos:** Upload photos of spotted trees
- **Notifications:** Alert team members when someone spots a tree
- **Social Features:** Team chat or activity feed
- **Achievements:** Badges for milestones
- **Individual Logins:** Optional individual player accounts

---

## Technical Architecture

### Technology Stack

**Frontend:**
- React 18 - UI framework
- React Router - Client-side routing
- Vite - Build tool and dev server
- CSS - Custom styling (no framework)

**Backend:**
- Node.js - Runtime
- Express - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- bcrypt - Password hashing

**Database:**
- MongoDB - Document database
- Flexible schema for teams/players
- Historical season data

**Hosting:**
- Currently: Local development
- Future: Cloud hosting (TBD)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           React Application                     │    │
│  │  - Login/Register                               │    │
│  │  - Dashboard (Score Tracking)                   │    │
│  │  - Leaderboards                                 │    │
│  │  - Team Management                              │    │
│  └────────────────────────────────────────────────┘    │
│                         │                               │
│                         │ HTTP/JSON                     │
│                         ▼                               │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Axios/Fetch API
                          │
┌─────────────────────────▼───────────────────────────────┐
│                  Express Backend API                     │
│                                                          │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Auth Routes   │  │ Team Routes  │  │ Leaderboard │  │
│  │ - Register    │  │ - Get Team   │  │   Routes    │  │
│  │ - Login       │  │ - Players    │  │ - Teams     │  │
│  │               │  │ - Increment  │  │ - Players   │  │
│  └───────────────┘  └──────────────┘  └─────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Middleware                             │  │
│  │  - JWT Authentication                             │  │
│  │  - CORS                                           │  │
│  │  - Error Handling                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         │ Mongoose ODM                  │
│                         ▼                               │
└─────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     MongoDB Database                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Teams      │  │   Seasons    │  │   (Future)   │  │
│  │ Collection   │  │ Collection   │  │   Photos     │  │
│  │              │  │              │  │   Comments   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Registration Flow:**
```
User → Frontend → POST /auth/register → Backend → MongoDB
  ↓
Creates Season (if needed)
  ↓
Creates Team
  ↓
Returns JWT Token
  ↓
Frontend stores token
  ↓
Redirects to Dashboard
```

**Score Update Flow:**
```
User clicks + button → Frontend → POST /teams/players/:id/increment
  ↓
JWT validated
  ↓
Player count incremented
  ↓
Team total updated
  ↓
Returns updated data
  ↓
Frontend updates UI (optimistic)
```

**Leaderboard Flow:**
```
User navigates to Leaderboards → GET /leaderboards/teams
  ↓
Backend queries all teams
  ↓
Calculates totals
  ↓
Sorts by count
  ↓
Returns ranked list
  ↓
Frontend displays with medals/rankings
```

---

## Database Schema

### Collections

#### Teams Collection

```javascript
{
  _id: ObjectId,
  teamName: "The Smith Family",
  password: "$2b$10$...",  // bcrypt hash
  players: [
    {
      _id: ObjectId,
      name: "John",
      count: 15,
      createdAt: ISODate("2024-11-25T...")
    },
    {
      _id: ObjectId,
      name: "Jane",
      count: 23,
      createdAt: ISODate("2024-11-25T...")
    }
  ],
  season: ObjectId("..."),  // Reference to Season
  createdAt: ISODate("2024-11-25T..."),
  updatedAt: ISODate("2024-12-15T...")
}
```

#### Seasons Collection

```javascript
{
  _id: ObjectId,
  year: 2024,
  startDate: ISODate("2024-11-25T00:00:00Z"),
  endDate: ISODate("2024-12-24T23:59:59Z"),
  isActive: true,
  createdAt: ISODate("2024-11-25T...")
}
```

### Indexes

**Current Indexes:**
- `teams.teamName` - Unique index for team name lookup
- `seasons.year` - Unique index for season lookup

**Future Indexes (for performance):**
- `teams.season` - For season-based queries
- `teams.updatedAt` - For recent activity queries

---

## Security Considerations

### Current Implementation

1. **Password Hashing**
   - bcrypt with 10 salt rounds
   - Passwords never stored in plain text

2. **JWT Authentication**
   - 30-day expiration
   - Signed with secret key
   - Validated on protected routes

3. **Input Validation**
   - Team names and player names trimmed
   - Password minimum length (6 chars)
   - Count limits (1-100 per increment)

4. **CORS**
   - Enabled for frontend access
   - Currently allows all origins (development)

### Production Security Needs

1. **Environment Variables**
   - Strong JWT secret
   - Secure MongoDB credentials
   - HTTPS enforcement

2. **Rate Limiting**
   - Prevent brute force attacks
   - Limit API calls per IP/user

3. **CORS Configuration**
   - Restrict to specific domains
   - Remove wildcard access

4. **HTTPS**
   - Encrypt all traffic
   - Secure cookie flags

5. **Input Sanitization**
   - Prevent XSS attacks
   - Validate all user input

6. **MongoDB Security**
   - Enable authentication
   - Use least-privilege users
   - Regular backups

---

## Design Decisions

### Why MongoDB?

- Flexible schema for teams/players
- Easy to add new fields later
- Good for hierarchical data (teams → players)
- Simple setup for small projects

### Why JWT?

- Stateless authentication
- Easy to implement
- Works well with mobile apps (future)
- No server-side session storage needed

### Why React?

- Component-based architecture
- Large ecosystem
- Good mobile support
- Fast development

### Why Single Team Login?

- Simplifies initial implementation
- Matches original game concept (team leader tracks)
- Easier for families (one password to remember)
- Can add individual logins later if needed

### Why Mobile-First?

- Most tree spotting happens while traveling
- Phone is most convenient for quick updates
- Easy to use while in the car
- Desktop is secondary use case

---

## Feature Roadmap

### Phase 1: MVP (Complete ✅)
- [x] Team registration
- [x] Team login
- [x] Add/edit/delete players
- [x] Increment/decrement counts
- [x] Team leaderboards
- [x] Individual leaderboards
- [x] Season tracking
- [x] Mobile-responsive design

### Phase 2: Enhancements (Planned)
- [ ] Photo uploads for sightings
- [ ] Image gallery per team
- [ ] Recent activity feed
- [ ] Better mobile UI tweaks
- [ ] Team profiles with stats
- [ ] Export data (CSV/JSON)

### Phase 3: Social Features (Future)
- [ ] Team chat
- [ ] Comments on photos
- [ ] Reactions/likes
- [ ] Team invitations via email
- [ ] Public vs private teams

### Phase 4: Mobile App (Future)
- [ ] iOS native app
- [ ] Android app (maybe)
- [ ] Push notifications
- [ ] Offline support
- [ ] Camera integration

### Phase 5: Gamification (Future)
- [ ] Achievements/badges
- [ ] Streaks
- [ ] Daily/weekly challenges
- [ ] Team vs team challenges
- [ ] Season rewards

---

## Development Guidelines

### Code Style

**JavaScript:**
- Use ES6+ features
- Async/await over promises
- Descriptive variable names
- Comments for complex logic

**React:**
- Functional components
- Hooks over class components
- PropTypes or TypeScript (future)
- Keep components small and focused

**CSS:**
- Mobile-first approach
- CSS variables for theming
- BEM-like naming (optional)
- Avoid !important

### Git Workflow

1. **Branches:**
   - `main` - Production-ready code
   - `develop` - Development branch
   - `feature/feature-name` - New features
   - `fix/bug-name` - Bug fixes

2. **Commits:**
   - Clear, descriptive messages
   - Reference issues when applicable
   - Use conventional commits (optional)

3. **Pull Requests:**
   - Describe changes
   - Link related issues
   - Request review before merge

### Testing (Future)

- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical flows
- Manual testing on mobile devices

---

## Deployment Considerations

### Current State
- Local development only
- MongoDB running on internal network
- Not publicly accessible

### Future Deployment Options

#### Option 1: Traditional Hosting
- **Frontend:** Netlify, Vercel, or GitHub Pages
- **Backend:** DigitalOcean, AWS EC2, or Heroku
- **Database:** MongoDB Atlas (free tier available)

#### Option 2: Containerized
- Docker containers for backend
- Deploy to AWS ECS, Google Cloud Run, or DigitalOcean
- MongoDB Atlas or containerized MongoDB

#### Option 3: Serverless
- Backend as serverless functions (AWS Lambda, Vercel Functions)
- MongoDB Atlas
- Frontend on CDN

### Environment Considerations

**Development:**
- Local MongoDB
- Hot reload enabled
- Debug logging
- CORS wide open

**Production:**
- Managed MongoDB (Atlas)
- Error logging only
- CORS restricted
- HTTPS enforced
- Environment variables secured

---

## Known Limitations

1. **No Email Verification**
   - Teams can register without email
   - Password reset not available
   - Account recovery difficult

2. **No Photo Uploads**
   - Would require file storage solution
   - Need image optimization
   - Storage costs

3. **No Real-time Updates**
   - Leaderboards don't auto-refresh
   - No WebSocket implementation
   - Manual refresh required

4. **Single Team Login**
   - Individual family members can't login separately
   - Team leader controls everything
   - Less individual autonomy

5. **No Admin Panel**
   - Must use MongoDB directly for admin tasks
   - No way to moderate teams
   - No analytics dashboard

---

## Contributing

This is primarily a personal/family project, but contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Contribution

- Bug fixes
- UI/UX improvements
- Documentation
- Testing
- Performance optimizations
- New features (discuss first)

---

## License

ISC License - Feel free to use and modify for your own family games!

---

## Contact & Support

- **GitHub:** https://github.com/leedy/tree
- **Issues:** https://github.com/leedy/tree/issues

---

## Acknowledgments

Built with Claude Code - An AI-powered coding assistant.

Special thanks to all the families who make this game fun during the holiday season!
