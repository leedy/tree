# Quick Deployment Checklist

## Before You Start
- [ ] Raspberry Pi IP: `<YOUR_PI_IP>`
- [ ] Existing app running on port: `4173`
- [ ] Tree app will use ports: `5001` (backend) and `4174` (frontend)

## Step-by-Step Checklist

### 1. Copy Files to Pi
```bash
cd /Users/leedy/CodeProjects/tree
rsync -av --exclude 'node_modules' --exclude '.git' . pi@<YOUR_PI_IP>:~/tree/
```

### 2. SSH into Pi
```bash
ssh pi@<YOUR_PI_IP>
```

### 3. Setup Backend
```bash
cd ~/tree/backend
npm install
nano .env  # Create .env file with MongoDB credentials
node server.js  # Test it works (Ctrl+C to stop)
```

### 4. Setup Frontend
```bash
cd ~/tree/frontend
npm install
nano .env  # Set VITE_API_URL=http://<YOUR_PI_IP>:5001/api
npm run build
```

### 5. Start with PM2
```bash
# Start backend
cd ~/tree/backend
pm2 start server.js --name tree-backend

# Start frontend
cd ~/tree/frontend
pm2 start npm --name tree-frontend -- run preview -- --port 4174 --host 0.0.0.0

# Check status
pm2 list

# Save for auto-restart
pm2 save
```

### 6. Test Access
- [ ] Backend API: http://<YOUR_PI_IP>:5001/api/auth/status
- [ ] Frontend: http://<YOUR_PI_IP>:4174
- [ ] Existing app still works: http://<YOUR_PI_IP>:4173

### 7. Register First Team
- [ ] Go to http://<YOUR_PI_IP>:4174
- [ ] Click "Register here"
- [ ] Create your team account
- [ ] Start adding players and tracking trees!

## Common Commands

**View logs:**
```bash
pm2 logs tree-backend
pm2 logs tree-frontend
```

**Restart apps:**
```bash
pm2 restart tree-backend
pm2 restart tree-frontend
```

**Stop apps:**
```bash
pm2 stop tree-backend
pm2 stop tree-frontend
```

**Monitor resources:**
```bash
pm2 monit
```

## Troubleshooting

**Can't access from laptop/phone?**
- Check Pi firewall: `sudo ufw status`
- Allow ports if needed: `sudo ufw allow 5001 && sudo ufw allow 4174`

**Backend won't start?**
- Check MongoDB is running: `sudo systemctl status mongod`
- Check .env file has correct credentials

**Frontend shows connection error?**
- Make sure `.env` has correct IP: `VITE_API_URL=http://<YOUR_PI_IP>:5001/api`
- Rebuild after changes: `npm run build && pm2 restart tree-frontend`

## Success!
Once both apps are running:
- Your existing app: http://<YOUR_PI_IP>:4173
- Tree on a Truck: http://<YOUR_PI_IP>:4174

Both apps run independently with no conflicts!
