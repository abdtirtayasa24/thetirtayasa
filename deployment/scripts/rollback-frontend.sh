#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/thetirtayasa}"
CURRENT_LINK="${CURRENT_LINK:-$APP_ROOT/frontend}"
ROLLBACK_TARGET="${1:-}"

if [[ -z "$ROLLBACK_TARGET" ]]; then
  echo "Usage: $0 /var/www/thetirtayasa/releases/<release>/frontend" >&2
  exit 1
fi

if [[ ! -d "$ROLLBACK_TARGET" ]]; then
  echo "Rollback target does not exist: $ROLLBACK_TARGET" >&2
  exit 1
fi

ln -sfn "$ROLLBACK_TARGET" "$CURRENT_LINK"
systemctl restart portfolio-nextjs.service
systemctl status portfolio-nextjs.service --no-pager
