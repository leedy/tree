# Tree on a Truck - Raspberry Pi Setup Guide

Complete guide for setting up Tree on a Truck on a Raspberry Pi with auto-start using systemd services.

---

## Prerequisites

- Raspberry Pi (4GB+ RAM recommended)
- Raspberry Pi OS installed
- Node.js 20.x installed
- MongoDB server (local or remote)
- Internet connection
- SSH access to your Pi

---

## Step 1: Clone Repository

```bash
cd ~
git clone https://github.com/leedy/tree.git
cd tree
```

---

## Step 2: Configure Backend Environment

### Create Backend .env File

```bash
cd ~/tree/backend
cp .env.template .env
nano .env
```

### Configure MongoDB Connection

**Example configuration:**
```env
# MongoDB Configuration
MONGO_HOST=192.168.1.27
MONGO_PORT=27017
MONGO_USERNAME=admin
MONGO_PASSWORD=mongopassword
MONGO_DATABASE=treeonatruck

# Server Configuration
PORT=3002

# JWT Secret (generate a random secure string)
JWT_SECRET=your-secret-key-change-this-in-production

# Game Season Configuration
SEASON_START_MONTH=11  # November (Black Friday)
SEASON_START_DAY=25    # Approximate Black Friday
SEASON_END_MONTH=12    # December
SEASON_END_DAY=24      # Christmas Eve
```

**Important notes:**
- `MONGO_HOST`: Your MongoDB server IP (use `localhost` if MongoDB is on the Pi)
- `MONGO_USERNAME/PASSWORD`: Your MongoDB credentials (leave empty if no auth)
- `MONGO_DATABASE`: Database name (must be `treeonatruck` or update in code)
- `PORT`: Backend port - use `3002` to avoid conflicts (3001 may be used by other apps)
- `JWT_SECRET`: Change this to a random secure string for production

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 3: Configure Frontend Environment

### Create Frontend .env File

```bash
cd ~/tree/frontend
cp .env.template .env
nano .env
```

### Configure API URL

**IMPORTANT:** Do NOT use `localhost` - use your Pi's actual IP address!

```env
VITE_API_URL=http://192.168.1.212:3002
```

**Replace with your actual Pi IP address.**

**Why not localhost?**
- The frontend runs in your browser (not on the Pi)
- Your browser needs to connect to the Pi's IP address
- Using `localhost` will try to connect to your laptop/phone instead

**Common mistake:** Adding `/api` at the end - DON'T! The code already adds it.
- ✅ Correct: `http://192.168.1.212:3002`
- ❌ Wrong: `http://192.168.1.212:3002/api` (creates double /api/api/)

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 4: Install Dependencies & Build

### Install Frontend Dependencies

```bash
cd ~/tree/frontend
npm install
```

This takes 5-10 minutes on Raspberry Pi.

### Build Frontend for Production

```bash
npm run build
```

This creates optimized production files in the `dist` folder.

### Install Backend Dependencies

```bash
cd ~/tree/backend
npm install
```

---

## Step 5: Create Systemd Services

Systemd services ensure your app:
- Starts automatically on boot
- Restarts if it crashes
- Runs in the background

### Backend Service

```bash
sudo nano /etc/systemd/system/tree-backend.service
```

Paste this configuration (update `User` to your username if not `leedy`):

```ini
[Unit]
Description=Tree on a Truck Backend Server
After=network.target

[Service]
Type=simple
User=leedy
WorkingDirectory=/home/leedy/tree/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Frontend Service

```bash
sudo nano /etc/systemd/system/tree-frontend.service
```

Paste this configuration (update `User` to your username if not `leedy`):

```ini
[Unit]
Description=Tree on a Truck Frontend Server
After=network.target tree-backend.service

[Service]
Type=simple
User=leedy
WorkingDirectory=/home/leedy/tree/frontend
ExecStart=/usr/bin/npm run preview -- --port 4174 --host 0.0.0.0
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Port Notes:**
- `4174` is the default production preview port
- Use `4173` if you want it to be the default, or any other available port
- Update if you have port conflicts with other apps

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 6: Enable & Start Services

### Reload Systemd

```bash
sudo systemctl daemon-reload
```

### Enable Services (Auto-start on Boot)

```bash
sudo systemctl enable tree-backend
sudo systemctl enable tree-frontend
```

### Start Services Now

```bash
sudo systemctl start tree-backend
sudo systemctl start tree-frontend
```

### Check Status

```bash
sudo systemctl status tree-backend
sudo systemctl status tree-frontend
```

You should see **"active (running)"** in green for both.

Press `q` to exit the status view.

---

## Step 7: Access Your Application

Open a web browser and go to:

**http://YOUR_PI_IP:4174**

For example: `http://192.168.1.212:4174`

You should see the Tree on a Truck login page with the logo!

---

## Step 8: Create Your First Team

1. Click **"Register here"**
2. Enter your team name (e.g., "Smith Family")
3. Create a password
4. Click **"Create Team"**
5. You'll be logged in to the Dashboard
6. Click **"Manage Team"** to add family members
7. Start tracking trees!

---

## Updating the App

### Using the Update Script (Recommended)

```bash
cd ~/tree
./update-tree.sh
```

This script automatically:
1. Pulls latest changes from GitHub
2. Installs any new dependencies
3. Rebuilds the frontend
4. Restarts both services

### Manual Update Steps

If you prefer to do it manually:

```bash
cd ~/tree
git pull
cd frontend
npm install
npm run build
cd ../backend
npm install
sudo systemctl restart tree-backend
sudo systemctl restart tree-frontend
```

---

## Troubleshooting

### Check Service Status

```bash
sudo systemctl status tree-backend
sudo systemctl status tree-frontend
```

### View Logs

**Backend logs (last 50 lines):**
```bash
sudo journalctl -u tree-backend -n 50
```

**Frontend logs (last 50 lines):**
```bash
sudo journalctl -u tree-frontend -n 50
```

**Follow logs in real-time:**
```bash
sudo journalctl -u tree-backend -f
```

Press `Ctrl+C` to stop following.

### Common Issues

#### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:** Change the port in `backend/.env`:
```bash
cd ~/tree/backend
nano .env
# Change PORT=3002 to PORT=3003 (or any free port)
sudo systemctl restart tree-backend
```

Also update frontend `.env` to match the new port!

#### MongoDB Connection Failed

**Check if MongoDB is running:**
```bash
sudo systemctl status mongod
# or
sudo systemctl status mongodb
```

**Start MongoDB if needed:**
```bash
sudo systemctl start mongod
```

**Check your backend `.env` file has correct MongoDB credentials.**

#### Frontend Shows "Load Failed" or "Route Not Found"

**Check frontend .env:**
```bash
cd ~/tree/frontend
cat .env
```

Make sure:
- ✅ Uses Pi's IP address (not `localhost`)
- ✅ Uses correct backend port (e.g., `3002`)
- ✅ Does NOT have `/api` at the end

**After fixing, rebuild:**
```bash
npm run build
sudo systemctl restart tree-frontend
```

#### Can't Access from Other Devices

**Allow ports in firewall (if enabled):**
```bash
sudo ufw allow 3002
sudo ufw allow 4174
```

**Verify Pi's IP address:**
```bash
hostname -I
```

### Restart Services

```bash
sudo systemctl restart tree-backend
sudo systemctl restart tree-frontend
```

### Stop Services

```bash
sudo systemctl stop tree-backend
sudo systemctl stop tree-frontend
```

### Disable Auto-Start

```bash
sudo systemctl disable tree-backend
sudo systemctl disable tree-frontend
```

---

## Running Alongside Other Apps

Tree on a Truck can run alongside other apps on the same Pi.

**Port Configuration:**
- Backend: `3002` (configurable in `backend/.env`)
- Frontend: `4174` (configurable in systemd service file)

**Example setup with multiple apps:**
- Dashboard Backend: 3001
- Dashboard Frontend: 4173
- Tree Backend: 3002
- Tree Frontend: 4174

Each app uses its own MongoDB database, so there are no conflicts.

---

## App URLs

- **Login/Register:** http://YOUR_PI_IP:4174
- **Dashboard:** http://YOUR_PI_IP:4174/dashboard
- **Leaderboards:** http://YOUR_PI_IP:4174/leaderboards
- **Countdown:** http://YOUR_PI_IP:4174/countdown
- **Rules:** http://YOUR_PI_IP:4174/rules

---

## Season Configuration

The game season is configured in `backend/.env`:

```env
SEASON_START_MONTH=11  # November
SEASON_START_DAY=25    # Black Friday (approximate)
SEASON_END_MONTH=12    # December
SEASON_END_DAY=24      # Christmas Eve
```

These dates determine when the countdown timer shows and when the season is active.

---

## Security Notes

1. **Change JWT_SECRET** in `backend/.env` to a random secure string
2. **Use strong passwords** for team accounts
3. **Keep your Pi updated:** `sudo apt update && sudo apt upgrade`
4. **Consider firewall rules** if exposing beyond your local network
5. **Don't commit .env files** to git (already in .gitignore)

---

## Performance

Tree on a Truck is lightweight and runs well on:
- Raspberry Pi 4 (4GB+ RAM recommended)
- Raspberry Pi 5
- Compatible with Pi 3 but may be slower

**Resource usage:**
- Backend: ~50-100MB RAM
- Frontend: Minimal (serves static files)

---

## Support

- Check logs: `sudo journalctl -u tree-backend -n 50`
- Review this guide's Troubleshooting section
- Check GitHub issues: https://github.com/leedy/tree/issues

---

## Game Season

**Season Dates:**
- **Start:** Black Friday (November 29, 2024)
- **End:** Christmas Eve (December 24, 2024)

**How to Play:**
1. Register your family as a team
2. Add all family members as players
3. When you spot a tree on a vehicle, shout "TREE!" and tap the + button
4. Check leaderboards to see how you rank
5. Have fun and be safe!

Review the Rules page in the app for complete gameplay rules.

---

## Happy Tree Hunting! 🎄🚙🎄
