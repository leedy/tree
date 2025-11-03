# Tree on a Truck - API Documentation

Complete API reference for the Tree on a Truck backend.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via JWT token.

### Getting a Token

Tokens are obtained through:
- `/auth/register` - Register new team (returns token)
- `/auth/login` - Login existing team (returns token)

### Using the Token

Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token-here>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3001/api/teams/me
```

### Token Expiration

- Tokens expire after 30 days
- Expired tokens return `403 Forbidden`
- Re-login to get a new token

## API Endpoints

### Health Check

#### GET /api/health

Check if the API server is running.

**Authentication:** Not required

**Response:**
```json
{
  "status": "ok",
  "message": "Tree on a Truck API is running",
  "timestamp": "2024-11-02T18:30:00.000Z"
}
```

---

## Authentication Endpoints

### Register Team

#### POST /api/auth/register

Register a new team for the current season.

**Authentication:** Not required

**Request Body:**
```json
{
  "teamName": "The Smith Family",
  "password": "password123"
}
```

**Field Requirements:**
- `teamName`: Required, must be unique, trimmed of whitespace
- `password`: Required, minimum 6 characters

**Success Response (201 Created):**
```json
{
  "message": "Team registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "team": {
    "id": "654abc123def456789012345",
    "teamName": "The Smith Family",
    "players": [],
    "season": 2024
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "message": "Team name and password are required"
}
```

409 Conflict:
```json
{
  "message": "Team name already exists"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "The Smith Family",
    "password": "password123"
  }'
```

---

### Login

#### POST /api/auth/login

Login to existing team account.

**Authentication:** Not required

**Request Body:**
```json
{
  "teamName": "The Smith Family",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "team": {
    "id": "654abc123def456789012345",
    "teamName": "The Smith Family",
    "players": [
      {
        "_id": "654abc123def456789012346",
        "name": "John",
        "count": 5
      },
      {
        "_id": "654abc123def456789012347",
        "name": "Jane",
        "count": 8
      }
    ],
    "totalCount": 13,
    "season": 2024
  }
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "message": "Invalid credentials"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "The Smith Family",
    "password": "password123"
  }'
```

---

## Team Management Endpoints

### Get Current Team

#### GET /api/teams/me

Get the authenticated team's details.

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "id": "654abc123def456789012345",
  "teamName": "The Smith Family",
  "players": [
    {
      "_id": "654abc123def456789012346",
      "name": "John",
      "count": 5,
      "createdAt": "2024-11-02T10:00:00.000Z"
    },
    {
      "_id": "654abc123def456789012347",
      "name": "Jane",
      "count": 8,
      "createdAt": "2024-11-02T10:00:00.000Z"
    }
  ],
  "totalCount": 13,
  "season": 2024,
  "createdAt": "2024-11-02T10:00:00.000Z"
}
```

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/teams/me
```

---

### Add Player

#### POST /api/teams/players

Add a new player to the team.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John"
}
```

**Field Requirements:**
- `name`: Required, will be trimmed, must be unique within team

**Success Response (201 Created):**
```json
{
  "message": "Player added successfully",
  "players": [
    {
      "_id": "654abc123def456789012346",
      "name": "John",
      "count": 0,
      "createdAt": "2024-11-02T10:00:00.000Z"
    }
  ],
  "totalCount": 0
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "message": "Player name is required"
}
```

409 Conflict:
```json
{
  "message": "Player name already exists in team"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/teams/players \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

---

### Update Player Name

#### PUT /api/teams/players/:playerId

Update a player's name.

**Authentication:** Required

**URL Parameters:**
- `playerId`: The player's ID

**Request Body:**
```json
{
  "name": "Johnny"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Player updated successfully",
  "players": [
    {
      "_id": "654abc123def456789012346",
      "name": "Johnny",
      "count": 5
    }
  ],
  "totalCount": 5
}
```

**Error Responses:**

404 Not Found:
```json
{
  "message": "Player not found"
}
```

409 Conflict:
```json
{
  "message": "Player name already exists in team"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3001/api/teams/players/654abc123def456789012346 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Johnny"}'
```

---

### Delete Player

#### DELETE /api/teams/players/:playerId

Remove a player from the team.

**Authentication:** Required

**URL Parameters:**
- `playerId`: The player's ID

**Success Response (200 OK):**
```json
{
  "message": "Player deleted successfully",
  "players": [],
  "totalCount": 0
}
```

**Error Responses:**

404 Not Found:
```json
{
  "message": "Player not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3001/api/teams/players/654abc123def456789012346 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Increment Player Count

#### POST /api/teams/players/:playerId/increment

Increment a player's tree count.

**Authentication:** Required

**URL Parameters:**
- `playerId`: The player's ID

**Request Body (Optional):**
```json
{
  "amount": 1
}
```

**Field Requirements:**
- `amount`: Optional, default 1, must be between 1-100

**Success Response (200 OK):**
```json
{
  "message": "Count updated successfully",
  "player": {
    "id": "654abc123def456789012346",
    "name": "John",
    "count": 6
  },
  "totalCount": 14
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "message": "Invalid increment amount (must be 1-100)"
}
```

**Example:**
```bash
# Increment by 1
curl -X POST http://localhost:3001/api/teams/players/654abc123def456789012346/increment \
  -H "Authorization: Bearer YOUR_TOKEN"

# Increment by 5
curl -X POST http://localhost:3001/api/teams/players/654abc123def456789012346/increment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5}'
```

---

### Decrement Player Count

#### POST /api/teams/players/:playerId/decrement

Decrement a player's tree count.

**Authentication:** Required

**URL Parameters:**
- `playerId`: The player's ID

**Request Body (Optional):**
```json
{
  "amount": 1
}
```

**Field Requirements:**
- `amount`: Optional, default 1, must be between 1-100
- Count cannot go below 0

**Success Response (200 OK):**
```json
{
  "message": "Count updated successfully",
  "player": {
    "id": "654abc123def456789012346",
    "name": "John",
    "count": 4
  },
  "totalCount": 12
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/teams/players/654abc123def456789012346/decrement \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Leaderboard Endpoints

### Team Leaderboard

#### GET /api/leaderboards/teams

Get team rankings, sorted by total count.

**Authentication:** Not required

**Query Parameters:**
- `season` (optional): Filter by specific year (e.g., `?season=2024`)

**Success Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "id": "654abc123def456789012345",
      "teamName": "The Smith Family",
      "totalCount": 45,
      "playerCount": 4,
      "season": 2024,
      "updatedAt": "2024-12-15T10:00:00.000Z"
    },
    {
      "id": "654abc123def456789012348",
      "teamName": "The Jones Family",
      "totalCount": 38,
      "playerCount": 3,
      "season": 2024,
      "updatedAt": "2024-12-14T15:30:00.000Z"
    }
  ],
  "season": 2024
}
```

**Example:**
```bash
# Current season
curl http://localhost:3001/api/leaderboards/teams

# Specific season
curl http://localhost:3001/api/leaderboards/teams?season=2023
```

---

### Individual Player Leaderboard

#### GET /api/leaderboards/players

Get individual player rankings across all teams, sorted by count.

**Authentication:** Not required

**Query Parameters:**
- `season` (optional): Filter by specific year

**Success Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "playerId": "654abc123def456789012347",
      "playerName": "Jane",
      "count": 25,
      "teamId": "654abc123def456789012345",
      "teamName": "The Smith Family",
      "season": 2024
    },
    {
      "playerId": "654abc123def456789012349",
      "playerName": "Bob",
      "count": 23,
      "teamId": "654abc123def456789012348",
      "teamName": "The Jones Family",
      "season": 2024
    }
  ],
  "season": 2024
}
```

**Example:**
```bash
curl http://localhost:3001/api/leaderboards/players
```

---

### Get All Seasons

#### GET /api/leaderboards/seasons

Get a list of all seasons.

**Authentication:** Not required

**Success Response (200 OK):**
```json
{
  "seasons": [
    {
      "year": 2024,
      "startDate": "2024-11-25T00:00:00.000Z",
      "endDate": "2024-12-24T23:59:59.999Z",
      "isActive": true
    },
    {
      "year": 2023,
      "startDate": "2023-11-25T00:00:00.000Z",
      "endDate": "2023-12-24T23:59:59.999Z",
      "isActive": false
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/leaderboards/seasons
```

---

## Error Responses

### Standard Error Format

All errors follow this format:

```json
{
  "message": "Error description here"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Token expired or insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (duplicate)
- `500 Internal Server Error` - Server error

### Authentication Errors

**401 Unauthorized:**
```json
{
  "message": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "message": "Invalid or expired token"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting to prevent abuse.

---

## Data Models

### Team Model

```javascript
{
  _id: ObjectId,
  teamName: String (unique),
  password: String (hashed),
  players: [Player],
  season: ObjectId (ref: Season),
  createdAt: Date,
  updatedAt: Date
}
```

### Player Model (Subdocument)

```javascript
{
  _id: ObjectId,
  name: String,
  count: Number (default: 0, min: 0),
  createdAt: Date
}
```

### Season Model

```javascript
{
  _id: ObjectId,
  year: Number (unique),
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  createdAt: Date
}
```

---

## Best Practices

### Security
- Always use HTTPS in production
- Store tokens securely (httpOnly cookies recommended for web)
- Never expose JWT_SECRET
- Implement rate limiting
- Validate all input data

### Performance
- Cache leaderboard data when possible
- Use pagination for large datasets (not implemented yet)
- Index frequently queried fields

### Error Handling
- Always check for error responses
- Handle network failures gracefully
- Provide user-friendly error messages

---

## Development & Testing

### Using curl

```bash
# Save token to variable
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"teamName":"TestTeam","password":"password123"}' \
  | jq -r '.token')

# Use token in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/teams/me
```

### Using Postman

1. Create a new request
2. Set Authorization type to "Bearer Token"
3. Paste your token in the Token field
4. Make your request

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3001/api/teams/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## Changelog

### v1.0.0 (Initial Release)
- Team registration and authentication
- Player management (CRUD)
- Score tracking (increment/decrement)
- Team and individual leaderboards
- Season management
- Historical data preservation
