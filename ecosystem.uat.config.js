/**
 * PM2 Configuration — UAT Environment
 * Usage: pm2 start ecosystem.uat.config.js
 *
 * UAT deploys always start with a FRESH database.
 * The deploy script (run-uat-server.sh) deletes payload.db before starting.
 *
 * IMPORTANT: SQLite requires single-process (fork) mode.
 * Never use cluster mode — it will cause SQLITE_BUSY errors.
 */
module.exports = {
  apps: [
    {
      name: 'atech-uat',
      script: './standalone/server.js',
      cwd: '/home/deploy/atech-uat/',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
        DATABASE_URL: 'file:/home/deploy/atech-uat/data/payload.db',
        PAYLOAD_MEDIA_DIR: '/home/deploy/atech-uat/media',
        NEXT_PUBLIC_SITE_URL_PROD: 'https://uat.atech.software',
        PAYLOAD_PUBLIC_SERVER_URL_PROD: 'https://uat.atech.software',
        NEXT_PUBLIC_DOMAIN_PROD: 'https://uat.atech.software',
        AWS_SES_SMTP_HOST: 'email-smtp.ap-southeast-1.amazonaws.com',
        AWS_SES_SMTP_PORT: '465',
        AWS_SES_SMTP_USER: 'AKIAUQUCCF6GRGXO5JJI',
        AWS_SES_SMTP_PASSWORD: 'BAuB8Opv6iWp4nFMn/gGN2S849xkOKxfqqJgNxBWY7MN',
        EMAIL_FROM: 'noreply@atech.software',
        EMAIL_FROM_NAME: 'Atech Software (UAT)',
      },
    }
  ],
};
