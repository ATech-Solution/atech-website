/**
 * PM2 Process Manager Configuration
 * Usage: pm2 start ecosystem.config.js --env production
 *
 * IMPORTANT: SQLite requires single-process (fork) mode.
 * Never use cluster mode — it will cause SQLITE_BUSY errors.
 */
module.exports = {
  apps: [
    {
      name: 'atech-website',
      // script: 'node',
      script: './.next/standalone/server.js', // Directly point to the standalone server    
      instances: 'max', // Utilizes all CPU cores
      // args: '.next/standalone/server.js',
      cwd: '/home/deploy/atech-website/',       // Change to your deployment path
      // instances: 1,                  // Must be 1 for SQLite
      exec_mode: 'fork',             // Must be fork (not cluster) for SQLite
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        DATABASE_URL: 'file:/home/deploy/atech-website/data/payload.db', // Fixes your SQLite "Error 14" by using an absolute path
        // standalone/server.js runs process.chdir(__dirname) on startup, so process.cwd()
        // becomes .next/standalone/ — not the project root. Use an absolute path so
        // Payload always reads/writes media from the correct persistent location.
        PAYLOAD_MEDIA_DIR: '/home/deploy/atech-website/media',
        // payload.config.ts reads these at runtime to build serverURL and allowedOrigins
        // (CORS/CSRF). Without them, serverURL defaults to http://localhost:3000, which
        // causes CSRF rejection for every admin panel API request and breaks the admin UI.
        NEXT_PUBLIC_SITE_URL_PROD: 'https://uat.atech.software',
        PAYLOAD_PUBLIC_SERVER_URL_PROD: 'https://uat.atech.software',
        NEXT_PUBLIC_DOMAIN_PROD: 'https://uat.atech.software',
         AWS_SES_SMTP_HOST: 'email-smtp.ap-southeast-1.amazonaws.com',
        AWS_SES_SMTP_PORT: '465',
         AWS_SES_SMTP_USER: 'AKIAUQUCCF6GRGXO5JJI',
         AWS_SES_SMTP_PASSWORD: 'BAuB8Opv6iWp4nFMn/gGN2S849xkOKxfqqJgNxBWY7MN',
        EMAIL_FROM: 'noreply@atech.software',
        EMAIL_FROM_NAME: 'Atech Software',
      },
    }
  ],
};