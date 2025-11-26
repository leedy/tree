# Enhancements & Issues Backlog

This file tracks identified issues and enhancements for the Tree on a Truck application.

## Legend
- [ ] Not started
- [x] Completed

---

## High Priority - Security

### 1. [x] XSS Vulnerability in Email Templates
**File:** `backend/services/emailService.js:37,40,82,141`
**Issue:** User input is directly interpolated into HTML without escaping. Malicious input like `<script>alert('xss')</script>` could render in emails.
**Fix:** Escape HTML entities in user-provided data before inserting into email templates.
**Status:** COMPLETED - Added `escapeHtml()` helper function and applied to all user inputs in HTML templates. Used `encodeURI()` for href attributes.

### 2. [x] Add Rate Limiting
**File:** `backend/server.js`
**Issue:** No rate limiting on sensitive endpoints makes the app vulnerable to brute force and spam attacks.
**Affected Endpoints:**
- `/api/auth/login` - brute force risk
- `/api/auth/register` - spam registration risk
- `/api/auth/forgot-password` - email bombing risk
- `/api/contact` - spam risk
**Fix:** Install `express-rate-limit` and apply appropriate limits to these endpoints.
**Status:** COMPLETED - Created `middleware/rateLimiter.js` with specific limiters:
- `authLimiter`: 10 attempts/15min (login, admin login)
- `registrationLimiter`: 5/hour (register)
- `passwordResetLimiter`: 3/hour (forgot-password)
- `contactLimiter`: 5/hour (contact form)

### 3. [x] Restrict CORS Origins
**File:** `backend/server.js:28`
**Issue:** `app.use(cors())` allows any origin to make requests.
**Fix:** Configure CORS to only allow known domains (localhost for dev, production domain).
**Status:** COMPLETED - Added CORS configuration allowing:
- localhost:5174, 4173, 3002 (development)
- treeonatruck.com (production)
- 192.168.1.20 on any port (local network)

---

## Medium Priority - Bugs

### 4. [x] Fix Activity Deletion Field Names
**File:** `backend/routes/admin.js:124,156-159`
**Issue:** Activity deletion uses wrong field names (`team` instead of `teamId`, `player` instead of `playerId`).
```javascript
// Current (wrong):
await Activity.deleteMany({ team: team._id });
// Should be:
await Activity.deleteMany({ teamId: team._id });
```
**Fix:** Update field names to match Activity model schema.
**Status:** COMPLETED - Changed `team` to `teamId` and `player` to `playerId` to match Activity model.

### 5. [x] Fix Leaderboard Null Access
**File:** `backend/routes/leaderboards.js:40,89`
**Issue:** Accessing `teams[0]?.season.year` when teams array could be empty.
**Fix:** Add proper null checks before accessing season data.
**Status:** COMPLETED - Changed to `teams[0]?.season?.year ?? null` with proper optional chaining.

---

## Medium Priority - Security Hardening

### 6. [x] Add Security Headers with Helmet.js
**File:** `backend/server.js`
**Issue:** Missing security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
**Fix:** Install and configure `helmet` middleware.
**Status:** COMPLETED - Added helmet middleware with default configuration.

### 7. [x] Improve Frontend Auth Validation
**File:** `frontend/src/services/api.js:204-206`
**Issue:** `isAuthenticated()` only checks if token exists, not if it's valid or expired.
**Fix:** Decode JWT and check expiration before returning true, or validate with backend.
**Status:** COMPLETED - Added `isTokenValid()` helper that decodes JWT and checks `exp` claim.

### 8. [x] Use Separate JWT Secrets
**File:** `backend/routes/auth.js`, `backend/routes/adminAuth.js`
**Issue:** Admin and team tokens use the same `JWT_SECRET`.
**Fix:** Add `ADMIN_JWT_SECRET` environment variable and use for admin tokens.
**Status:** COMPLETED - Added ADMIN_JWT_SECRET with fallback to JWT_SECRET for backwards compatibility.

---

## Low Priority - Input Validation

### 9. [ ] Add Input Length Limits
**Files:** `backend/models/Team.js`, `backend/models/Admin.js`
**Issue:** Missing length validation on team names, player names, and admin usernames.
**Fix:** Add `maxlength` constraints to mongoose schemas.

### 10. [ ] Add Maximum Players Per Team Limit
**File:** `backend/routes/teams.js`
**Issue:** Teams can add unlimited players.
**Fix:** Add a configurable limit (e.g., 20 players per team).

### 11. [x] Validate Tracking Path Input
**File:** `backend/routes/tracking.js`
**Issue:** The `path` field is stored without length or format validation.
**Fix:** Add length limit and basic path format validation.
**Status:** COMPLETED - Added validation: path required, max 500 chars, must start with `/`. Referrer limited to 1000 chars.

---

## Configuration Issues

### 12. [x] Fix Port Mismatch in Templates
**Files:** `backend/.env.template:9`, `frontend/vite.config.js:19`
**Issue:** Template says `PORT=3001` but proxy expects `3002`.
**Fix:** Update `.env.template` to use `PORT=3002`.
**Status:** COMPLETED - Updated PORT to 3002 in .env.template.

### 13. [x] Fix Database Name Inconsistency
**File:** `backend/.env.template:6`
**Issue:** Template uses `treeontruck` but documentation says `treeonatruck`.
**Fix:** Update template to use `treeonatruck`.
**Status:** COMPLETED - Updated MONGO_DATABASE to treeonatruck in .env.template.

---

## Future Enhancements

### 14. [ ] Add HTTPS Enforcement
**Issue:** No automatic HTTP to HTTPS redirect in production.

### 15. [ ] Add Session/Token Revocation
**Issue:** No way to invalidate tokens or log out from all devices.

### 16. [ ] Add Admin Audit Logging
**Issue:** Admin actions are not logged for accountability.

---

## Completed

(Move items here when finished)
