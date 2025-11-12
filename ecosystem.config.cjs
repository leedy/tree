module.exports = {
  apps: [
    {
      name: 'tree-backend',
      cwd: '/home/leedy/tree/backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/home/leedy/tree/logs/backend-error.log',
      out_file: '/home/leedy/tree/logs/backend-out.log',
      time: true,
    }
  ]
};
