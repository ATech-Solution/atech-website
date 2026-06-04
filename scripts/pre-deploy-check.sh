#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# ATech Site — Pre-Deploy Smoke Check
# Usage:
#   ./scripts/pre-deploy-check.sh          # test localhost:3000
#   ./scripts/pre-deploy-check.sh --uat    # test uat.atech.software
#   ./scripts/pre-deploy-check.sh --prod   # test atech.software
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

PASS=0; FAIL=0; WARN=0
RESULTS=()

# ── Target ────────────────────────────────────────────────────────────────────
BASE="http://localhost:3000"
TARGET="local"
for arg in "$@"; do
  case $arg in
    --uat)  BASE="https://uat.atech.software";  TARGET="UAT"  ;;
    --prod) BASE="https://atech.software";      TARGET="PROD" ;;
  esac
done

echo ""
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
echo -e "${BOLD}  ATech Pre-Deploy Smoke Check — ${TARGET}${RESET}"
echo -e "${BOLD}  Target: ${BASE}${RESET}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
echo ""

# ── Helper ────────────────────────────────────────────────────────────────────
check() {
  local label="$1"
  local url="$2"
  local expected="${3:-200}"

  local start_ms=$(($(date +%s%N)/1000000))
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 --location "$url" 2>/dev/null || echo "000")
  local end_ms=$(($(date +%s%N)/1000000))
  local dur=$((end_ms - start_ms))

  if [[ "$code" == "$expected" ]] || ([[ "$expected" == "200" ]] && [[ "$code" -lt 400 ]] && [[ "$code" -gt 0 ]]); then
    echo -e "  ${GREEN}✅ PASS${RESET}  ${label}  ${CYAN}[${code}]${RESET}  ${dur}ms"
    RESULTS+=("PASS|${label}|${code}|${dur}ms")
    PASS=$((PASS + 1))
  elif [[ "$code" == "000" ]]; then
    echo -e "  ${RED}❌ FAIL${RESET}  ${label}  ${RED}[TIMEOUT/ERROR]${RESET}"
    RESULTS+=("FAIL|${label}|ERROR|${dur}ms")
    FAIL=$((FAIL + 1))
  else
    echo -e "  ${RED}❌ FAIL${RESET}  ${label}  ${RED}[${code}]${RESET}  ${dur}ms"
    RESULTS+=("FAIL|${label}|${code}|${dur}ms")
    FAIL=$((FAIL + 1))
  fi
}

section() {
  echo ""
  echo -e "${BOLD}${CYAN}── $1 ─────────────────────────────────${RESET}"
}

# ─────────────────────────────────────────────────────────────────────────────
# Tier 1 — Build checks (local only)
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$TARGET" == "local" ]]; then
  section "Tier 1 — TypeScript & Lint"
  echo -e "  ${CYAN}Running tsc --noEmit…${RESET}"
  if npx tsc --noEmit --project tsconfig.json 2>/dev/null; then
    echo -e "  ${GREEN}✅ PASS${RESET}  TypeScript check"
    RESULTS+=("PASS|TypeScript check|OK|—")
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${RESET}  TypeScript errors found"
    RESULTS+=("FAIL|TypeScript check|ERRORS|—")
    FAIL=$((FAIL + 1))
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# Tier 2 — Key pages (all locales)
# ─────────────────────────────────────────────────────────────────────────────
section "Tier 2 — Pages"
check "Homepage (EN)"      "${BASE}/en"
check "Homepage (ZH-HK)"   "${BASE}/zh-hk"
check "Homepage (ZH-CN)"   "${BASE}/zh-cn"
check "Homepage (ID)"      "${BASE}/id"
check "About Us"           "${BASE}/en/about-us"
check "Contact"            "${BASE}/en/contact"
check "FAQ"                "${BASE}/en/faq"
check "Portfolio"          "${BASE}/en/portfolio"
check "Insights"           "${BASE}/en/insight"
check "QA Testing Service" "${BASE}/en/services/qa-testing"
check "Web Development"    "${BASE}/en/services/web-development"
check "Who We Serve"       "${BASE}/en/who-we-serve"
check "Get Involved"       "${BASE}/en/get-involved"

# ─────────────────────────────────────────────────────────────────────────────
# Tier 3 — Admin
# ─────────────────────────────────────────────────────────────────────────────
section "Tier 3 — Admin"
check "Admin Dashboard"    "${BASE}/admin"

# ─────────────────────────────────────────────────────────────────────────────
# Tier 4 — API endpoints
# ─────────────────────────────────────────────────────────────────────────────
section "Tier 4 — API Health"
check "/api/maintenance-status"                    "${BASE}/api/maintenance-status"
check "/api/theme"                                 "${BASE}/api/theme"
check "/api/plugins/multilanguage/settings"        "${BASE}/api/plugins/multilanguage/settings"
check "/api/plugins/form-builder/stats (auth)"     "${BASE}/api/plugins/form-builder/stats" "401"

# ─────────────────────────────────────────────────────────────────────────────
# Tier 5 — Static assets
# ─────────────────────────────────────────────────────────────────────────────
section "Tier 5 — Static Assets"
check "favicon.ico"   "${BASE}/favicon.ico"
check "robots.txt"    "${BASE}/robots.txt"

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
TOTAL=$((PASS + FAIL + WARN))
SCORE=0
if [[ $TOTAL -gt 0 ]]; then
  SCORE=$(( (PASS * 100) / TOTAL ))
fi

echo -e "${BOLD}  Summary — ${TARGET}${RESET}"
echo -e "  Total:  ${TOTAL}"
echo -e "  ${GREEN}Pass:   ${PASS}${RESET}"
[[ $FAIL -gt 0 ]] && echo -e "  ${RED}Fail:   ${FAIL}${RESET}" || echo -e "  Fail:   0"
[[ $WARN -gt 0 ]] && echo -e "  ${YELLOW}Warn:   ${WARN}${RESET}" || echo -e "  Warn:   0"
echo -e "  Score:  ${SCORE}%"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
echo ""

if [[ $FAIL -gt 0 ]]; then
  echo -e "${RED}${BOLD}❌ SMOKE CHECK FAILED — ${FAIL} test(s) failed${RESET}"
  echo ""
  exit 1
else
  echo -e "${GREEN}${BOLD}✅ SMOKE CHECK PASSED — ready to deploy${RESET}"
  echo ""
  exit 0
fi
