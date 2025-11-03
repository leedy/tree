# Tree on a Truck - Raspberry Pi Deployment Guide

## Prerequisites

Your Raspberry Pi should already have:
- Node.js and npm installed
- MongoDB running
- PM2 installed (for process management)

## Deployment Steps

### 1. Copy Project to Raspberry Pi

From your laptop, copy the project to your Pi:

```bash
# From your laptop
cd /Users/leedy/CodeProjects/tree
rsync -av --exclude 'node_modules' --exclude '.git' . pi@<YOUR_PI_IP>:~/tree/
```

Or manually copy the folder using your preferred method.

### 2. Setup Backend on Raspberry Pi

SSH into your Pi:
```bash
ssh pi@<YOUR_PI_IP>
```

Navigate to the project and install dependencies:
```bash
cd ~/tree/backend
npm install
```

Create the `.env` file:
```bash
nano .env
```

Add your MongoDB connection (update if needed):
```env
MONGODB_URI=mongodb://admin:yourpassword@localhost:27017/treeonatruck?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5001
NODE_ENV=production
```

Test the backend:
```bash
node server.js
```

You should see: "Server running on port 5001" and "Connected to MongoDB"

### 3. Setup Frontend on Raspberry Pi

Build the frontend for production:
```bash
cd ~/tree/frontend
npm install
```

Update the API URL in `.env`:
```bash
nano .env
```

Set it to use the Pi's IP:
```env
VITE_API_URL=http://<YOUR_PI_IP>:5001/api
```

Build the production version:
```bash
npm run build
```

### 4. Serve Frontend (Option 1: Using Vite Preview)

This serves the built files on a specific port:
```bash
npm run preview -- --port 4174 --host 0.0.0.0
```

Access at: `http://<YOUR_PI_IP>:4174`

### 5. Run with PM2 (Recommended for Production)

Start the backend:
```bash
cd ~/tree/backend
pm2 start server.js --name tree-backend
```

Start the frontend (preview server):
```bash
cd ~/tree/frontend
pm2 start npm --name tree-frontend -- run "preview -- --port 4174 --host 0.0.0.0"
```

Check status:
```bash
pm2 list
```

You should see both apps running:
- tree-backend (port 5001)
- tree-frontend (port 5173)

Save PM2 configuration to auto-start on reboot:
```bash
pm2 save
pm2 startup
# Follow the instructions provided by pm2 startup
```

### 6. Access Your Apps

- **Existing app**: http://<YOUR_PI_IP>:4173
- **Tree on a Truck**: http://<YOUR_PI_IP>:4174

## Managing Both Apps

View all running apps:
```bash
pm2 list
```

View logs:
```bash
pm2 logs tree-backend
pm2 logs tree-frontend
pm2 logs  # All apps
```

Restart an app:
```bash
pm2 restart tree-backend
pm2 restart tree-frontend
```

Stop an app:
```bash
pm2 stop tree-backend
pm2 stop tree-frontend
```

## Troubleshooting

### Port Already in Use
If port 4174 or 5001 is already taken, change them:
- Backend: Edit `backend/.env` PORT value
- Frontend: Use different port with `--port XXXX`

### MongoDB Connection Issues
Check MongoDB is running:
```bash
sudo systemctl status mongod
```

Start MongoDB if needed:
```bash
sudo systemctl start mongod
```

### Can't Access from Other Devices
Make sure your Pi's firewall allows the ports:
```bash
sudo ufw allow 5001
sudo ufw allow 4174
```

### Frontend Can't Connect to Backend
Update `frontend/.env` to use your Pi's IP address, then rebuild:
```bash
cd ~/tree/frontend
npm run build
pm2 restart tree-frontend
```

## Optional: Nginx Reverse Proxy

If you want to use nginx (more production-ready):

1. Install nginx (if not already):
```bash
sudo apt install nginx
```

2. Create nginx config:
```bash
sudo nano /etc/nginx/sites-available/tree
```

Add:
```nginx
server {
    listen 80;
    server_name <YOUR_PI_IP>;  # Or your domain

    # Tree on a Truck
    location /tree/ {
        proxy_pass http://localhost:4174/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /tree/api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Your existing app
    location / {
        proxy_pass http://localhost:4173/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable and restart nginx:
```bash
sudo ln -s /etc/nginx/sites-available/tree /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Access:
- Existing app: http://<YOUR_PI_IP>/
- Tree app: http://<YOUR_PI_IP>/tree/

## Resource Monitoring

Check system resources:
```bash
htop
```

Monitor PM2 apps:
```bash
pm2 monit
```

## Updates

To update the app after making changes:

1. Pull/copy new code to Pi
2. Backend:
```bash
cd ~/tree/backend
npm install  # If dependencies changed
pm2 restart tree-backend
```

3. Frontend:
```bash
cd ~/tree/frontend
npm install  # If dependencies changed
npm run build
pm2 restart tree-frontend
```
