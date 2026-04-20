module.exports = {
  apps: [{
    name: 'atech-website',
    script: './.next/standalone/server.js', // Directly point to the standalone server
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Fixes your SQLite "Error 14" by using an absolute path
      DATABASE_URL: 'file:/home/deploy/atech-website/data/payload.db' 
    },
    instances: 'max', // Utilizes all CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false
  }]
};