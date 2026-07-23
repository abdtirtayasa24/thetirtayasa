#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://thetirtayasa.my.id}"
API_URL="${API_URL:?Set API_URL to the FastAPI Cloud backend origin, for example https://your-backend.fastapi.app}"

check_frontend() {
  local path="$1"
  curl --fail --silent --show-error --location --max-time 15 "$BASE_URL$path" >/dev/null
  echo "ok frontend $path"
}

check_api() {
  local path="$1"
  curl --fail --silent --show-error --location --max-time 15 "$API_URL$path" >/dev/null
  echo "ok backend $path"
}

check_frontend "/"
check_frontend "/projects"
check_frontend "/resume"
check_frontend "/contact"
check_frontend "/robots.txt"
check_frontend "/sitemap.xml"
check_api "/health"

curl --fail --silent --show-error --max-time 20 \
  -H "content-type: application/json" \
  -X POST "$API_URL/v1/chat" \
  -d '{"message":"What projects has Abdul built?"}' \
  | grep -E "event: (token|error|done)" >/dev/null

echo "ok backend /v1/chat graceful response"
