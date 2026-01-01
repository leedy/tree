const path = require('path');
const appDir = __dirname;

module.exports = {
  apps: [
    {
      name: 'tree-backend',
      cwd: path.join(appDir, 'backend'),
      script: 'server.js',
      env: {
        NODE_ENV: 'development',
      },
      error_file: path.join(appDir, 'logs/backend-error.log'),
      out_file: path.join(appDir, 'logs/backend-out.log'),
      time: true,
    },
    {
      name: 'tree-frontend',
      cwd: path.join(appDir, 'frontend'),
      script: 'node_modules/.bin/vite',
      args: '--host',
      env: {
        NODE_ENV: 'development',
      },
      error_file: path.join(appDir, 'logs/frontend-error.log'),
      out_file: path.join(appDir, 'logs/frontend-out.log'),
      time: true,
    }
  ]
};
