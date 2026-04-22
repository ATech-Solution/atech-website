# standard production on local deployment script for Next.js app with PM2
#!/bin/bash
#set -e

# conntect to server
# ssh -i ~/.ssh/id_rsa root@xxxxxxxxx

echo "📥 db migrate:latest" 
# npm run migrate:create 
npm run migrate:latest

echo "📥 Clean build artifacts before run dev, make sure already on local and pass .next"
# rm -rf .next .payload node_modules package-lock.json pnpm-lock.yaml
rm -rf .next .payload node_modules/.cache

echo "📥 Skip installing dependencies..." 
npm install

npm run generate:types && npm run generate:importmap

echo "🏗️  Building standalone bundle... create zip before run dev and upload 1st"
echo "skip 🏗️ Building app... make sure already on local and pass .next"
npm run build

# echo "📂 Copying static chunks into standalone..."
# cp -r .next/static .next/standalone/.next/static

# echo "📂 Merging public/ assets into standalone..."
# cp -r public/. .next/standalone/public/

echo "🚀 Starting dev server at http://localhost:3000"
sudo kill -9 $(sudo lsof -t -i:3000 -i:3001) 
npm run dev

#  The config property `experimental.turbo` is deprecated. 
#  Move this setting to `config.turbopack` or run `npx @next/codemod@latest next-experimental-turbo-to-turbopack .`
# next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead

# exec env \
#   NODE_ENV=production \
#   PORT=3000 \
#   HOSTNAME=127.0.0.1 \
#   DATABASE_URL="file:${PROJECT_ROOT}/data/payload.db" \
#   PAYLOAD_MEDIA_DIR="${PROJECT_ROOT}/public/media" \
#   NEXT_PUBLIC_SITE_URL_PROD="http://localhost:3000" \
#   PAYLOAD_PUBLIC_SERVER_URL_PROD="http://localhost:3000" \
#   PAYLOAD_SECRET="${PAYLOAD_SECRET:-local-dev-secret-change-in-prod}" \
#   node .next/standalone/server.js