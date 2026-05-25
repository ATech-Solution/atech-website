#!/usr/bin/env bash
# ============================================================
# sync-media-to-uat.sh
# Sync local ./media/ → UAT server media directory
#
# Usage:
#   ./sync-media-to-uat.sh            # upload all media
#   ./sync-media-to-uat.sh --dry-run  # preview without transferring
#
# Requires:
#   - ~/.ssh/github_actions_deploy    SSH key for the deploy user
#   - .env.deploy                     local config (see .env.deploy.example)
# ============================================================
set -euo pipefail

# ── Load local deploy config ──────────────────────────────────
if [ -f ".env.deploy" ]; then
  # shellcheck disable=SC1091
  source .env.deploy
fi

HOST="${DEPLOY_UAT_HOST:-}"
if [ -z "$HOST" ]; then
  echo "Error: DEPLOY_UAT_HOST is not set."
  echo "Copy .env.deploy.example to .env.deploy and fill in the UAT server host."
  exit 1
fi

# ── Config ────────────────────────────────────────────────────
SSH_KEY="$HOME/.ssh/github_actions_deploy"
REMOTE_USER="deploy"
REMOTE_PATH="/home/deploy/atech-uat/media/"
LOCAL_PATH="./media/"

# ── Dry-run flag ─────────────────────────────────────────────
DRY_RUN_FLAG=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN_FLAG="--dry-run"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  DRY RUN — no files will be transferred"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MEDIA SYNC → UAT  $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  From : $LOCAL_PATH"
echo "  To   : $REMOTE_USER@$HOST:$REMOTE_PATH"
echo "  Key  : $SSH_KEY"
echo ""

if [ ! -f "$SSH_KEY" ]; then
  echo "Error: SSH key not found at $SSH_KEY"
  echo "Make sure github_actions_deploy private key is present in ~/.ssh/"
  exit 1
fi

if [ ! -d "$LOCAL_PATH" ]; then
  echo "Error: local media directory '$LOCAL_PATH' does not exist."
  exit 1
fi

# ── rsync ─────────────────────────────────────────────────────
rsync -avz --progress $DRY_RUN_FLAG \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" \
  "$LOCAL_PATH" \
  "$REMOTE_USER@$HOST:$REMOTE_PATH"

echo ""
if [[ -z "$DRY_RUN_FLAG" ]]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ Media sync complete — https://uat.atech.software"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Dry run complete. Run without --dry-run to transfer."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi
