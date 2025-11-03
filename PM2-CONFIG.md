# PM2 Configuration Guide

## Explicitly Setting Ports for Both Apps

To avoid confusion and ensure consistent ports regardless of startup order, explicitly set ports in your PM2 commands.

### Option 1: Using PM2 Commands (Recommended)

**Dashboard App:**
```bash
cd ~/dashboard/frontend
pm2 start npm --name dashboard-frontend -- run preview -- --port 4173 --host 0.0.0.0
```

**Tree App:**
```bash
cd ~/tree/frontend
pm2 start npm --name tree-frontend -- run preview -- --port 4174 --host 0.0.0.0
```

Now your ports are fixed:
- Dashboard: Always 4173
- Tree: Always 4174

### Option 2: Using PM2 Ecosystem File

Create `ecosystem.config.js` in your home directory:

```javascript
module.exports = {
  apps: [
    {
      name: 'dashboard-backend',
      cwd: '/home/pi/dashboard/backend',
      script: 'server.js',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'dashboard-frontend',
      cwd: '/home/pi/dashboard/frontend',
      script: 'npm',
      args: 'run preview -- --port 4173 --host 0.0.0.0'
    },
    {
      name: 'tree-backend',
      cwd: '/home/pi/tree/backend',
      script: 'server.js',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'tree-frontend',
      cwd: '/home/pi/tree/frontend',
      script: 'npm',
      args: 'run preview -- --port 4174 --host 0.0.0.0'
    }
  ]
};
```

Then start all apps at once:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## Backend Port Configuration

Backend ports are set in the `.env` file:

**Dashboard backend** (`~/dashboard/backend/.env`):
```env
PORT=3000
```

**Tree backend** (`~/tree/backend/.env`):
```env
PORT=3001
```

## Summary

With explicit port configuration:
- **Dashboard Backend**: 3000
- **Dashboard Frontend**: 4173
- **Tree Backend**: 3001
- **Tree Frontend**: 4174

**No conflicts, regardless of startup order!**

## Managing All Apps

View all apps:
```bash
pm2 list
```

Start all:
```bash
pm2 start all
```

Stop all:
```bash
pm2 stop all
```

Restart all:
```bash
pm2 restart all
```

Restart specific app:
```bash
pm2 restart tree-frontend
```
