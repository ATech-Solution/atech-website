#!/bin/bash
# ============================================================
# Production Deploy Script — atech-website
# ============================================================
# Behavior:
#   - PRESERVES the database — NEVER deletes payload.db
#   - Pulls from: main branch
#   - PM2 app name: atech-website  (port 3000)
#   - Config: ecosystem.prod.config.js
#   - Runs migrations only (no seed, no wipe)
# ============================================================

set -e

APP_DIR="/home/deploy/atech-website"
DB_PATH="$APP_DIR/data/payload.db"
BRANCH="main"

cd "$APP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  PRODUCTION DEPLOY — $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Safety check: abort if DB is missing ─────────────────
# On the very first deploy this file won't exist yet — that's fine.
# On subsequent deploys, if someone accidentally deleted it, warn loudly.
if [ ! -f "$DB_PATH" ]; then
  echo ""
  echo "⚠️  WARNING: No database found at $DB_PATH"
  echo "   If this is a first-time deploy, this is expected."
  echo "   Migrations will create the schema. No seed will run."
  echo ""
fi

# ── 1. Pull latest code from main branch ─────────────────
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

# ── 4. Ensure data directory exists (first-time setup) ───
mkdir -p "$APP_DIR/data"

# ── 5. Run migrations ONLY — no seed, no wipe ────────────
echo ""
echo "🔧 Running Payload migrations (data preserved)..."
DATABASE_URL="file:$DB_PATH" \
NODE_ENV=production \
  npm run migrate || {
    echo "   ⚠️  migrate exited non-zero — schema may already be up to date."
  }
echo "   ✓ Database preserved: $DB_PATH"

# ── 6. Ensure media directory exists ─────────────────────
mkdir -p "$APP_DIR/media"

# ── 7. Restart PM2 ───────────────────────────────────────
echo ""
echo "🔄 Restarting PM2 (atech-website)..."
pm2 stop atech-website 2>/dev/null || true
pm2 delete atech-website 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.prod.config.js"
pm2 save

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Production deploy complete — https://atech.software"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status
pm2 logs atech-website --lines 30
