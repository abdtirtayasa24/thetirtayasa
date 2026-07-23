#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/thetirtayasa}"
RELEASE_DIR="${RELEASE_DIR:-$APP_ROOT/releases/$(date +%Y%m%d%H%M%S)}"
CURRENT_LINK="${CURRENT_LINK:-$APP_ROOT/frontend}"

mkdir -p "$RELEASE_DIR"
rsync -a --delete frontend/ "$RELEASE_DIR/frontend/"
rsync -a --delete content/ "$RELEASE_DIR/content/"
cd "$RELEASE_DIR/frontend"
bun install --frozen-lockfile
bun run build

rm -rf .next/standalone/.next/static .next/standalone/public
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static
cp -R public .next/standalone/public

ln -sfn "$RELEASE_DIR/frontend" "$CURRENT_LINK"
systemctl daemon-reload
systemctl restart portfolio-nextjs.service
systemctl status portfolio-nextjs.service --no-pager
