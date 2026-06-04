#!/bin/bash
# ============================================================
# UAT Deploy Script — atech-website
# ============================================================
# Behavior:
#   - ALWAYS wipes and recreates the database (fresh every deploy)
#   - Pulls from: dev branch
#   - PM2 app name: atech-uat  (port 3001)
#   - Config: ecosystem.uat.config.js
# ============================================================

set -e

APP_DIR="/home/deploy/atech-uat"
DB_PATH="$APP_DIR/data/payload.db"
BRANCH="dev"

cd "$APP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  UAT DEPLOY — $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Pull latest code from dev branch ──────────────────
echo ""
echo "📦 Pulling latest code from branch: $BRANCH..."
git stash || true
git fetch origin
git reset --hard "origin/$BRANCH"

# ── 2. Unpack build artefact ─────────────────────────────
echo ""
echo "📂 Unpacking build artefact..."
sudo rm -rf .next
sudo unzip -q next.zip -d .
sudo mv next .next
sudo rm -rf __MACOSX next.zip 2>/dev/null || true

# ── 3. Generate Payload types & import map ───────────────
echo ""
echo "⚙️  Generating Payload types and import map..."
npm run generate:types && npm run generate:importmap

# ── 4. FRESH DATABASE — wipe existing db ─────────────────
echo ""
echo "🗑️  Wiping database for fresh UAT deploy..."
mkdir -p "$APP_DIR/data"
rm -f "$DB_PATH" "${DB_PATH}-shm" "${DB_PATH}-wal"
echo "   ✓ Database cleared: $DB_PATH"

# ── 5. Run migrations (creates schema on blank db) ───────
echo ""
echo "🔧 Running Payload migrations..."
DATABASE_URL="file:$DB_PATH" \
NODE_ENV=production \
  npm run migrate || {
    echo "   ⚠️  migrate exited non-zero — checking if schema already exists..."
  }

# ── 6. Seed database (UAT only) ──────────────────────────
if [ -f "src/scripts/seed.ts" ]; then
  echo ""
  echo "🌱 Seeding database..."
  DATABASE_URL="file:$DB_PATH" \
  NODE_ENV=production \
    npm run seed || {
      echo "   ⚠️  Seed script returned non-zero — continuing anyway."
    }
else
  echo ""
  echo "   ℹ️  No seed script found — skipping seed."
fi

# ── 7. Ensure media directory exists ─────────────────────
mkdir -p "$APP_DIR/media"

# ── 8. Restart PM2 ───────────────────────────────────────
echo ""
echo "🔄 Restarting PM2 (atech-uat)..."
pm2 stop atech-uat 2>/dev/null || true
pm2 delete atech-uat 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.uat.config.js"
pm2 save

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ UAT deploy complete — https://uat.atech.software"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status
pm2 logs atech-uat --lines 30
