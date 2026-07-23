#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run with sudo: sudo deployment/scripts/install-nginx-frontend.sh" >&2
  exit 1
fi

install -d /etc/nginx/conf.d /etc/nginx/sites-available /etc/nginx/sites-enabled /var/www/certbot
install -m 0644 deployment/nginx/conf.d/thetirtayasa-rate-limit.conf /etc/nginx/conf.d/thetirtayasa-rate-limit.conf
install -m 0644 deployment/nginx/thetirtayasa.my.id.conf /etc/nginx/sites-available/thetirtayasa.my.id.conf
ln -sfn /etc/nginx/sites-available/thetirtayasa.my.id.conf /etc/nginx/sites-enabled/thetirtayasa.my.id.conf

nginx -t
systemctl reload nginx
systemctl status nginx --no-pager
