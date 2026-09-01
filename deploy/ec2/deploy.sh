#!/usr/bin/env bash
#
# Deployment script — run on the EC2 instance after every release.
# Called automatically by GitHub Actions, or manually:
#   bash /var/www/pintu-dua-coffeehouse/deploy/ec2/deploy.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/pintu-dua-coffeehouse}"
BRANCH="${BRANCH:-main}"
PHP_VERSION="${PHP_VERSION:-8.3}"

log() { echo "[deploy] $(date '+%Y-%m-%d %H:%M:%S') $*"; }

if [[ ! -d "${APP_DIR}/.git" ]]; then
  echo "Application not found at ${APP_DIR}. Run setup-server.sh first." >&2
  exit 1
fi

cd "${APP_DIR}"

log "Pulling latest code from origin/${BRANCH}..."
git fetch origin "${BRANCH}"
git reset --hard "origin/${BRANCH}"

log "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

log "Building frontend (React client)..."
npm ci --ignore-scripts
npm run build

log "Running database migrations..."
php artisan migrate --force

log "Linking public storage..."
php artisan storage:link --force 2>/dev/null || true

log "Caching Laravel config, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

log "Fixing permissions..."
sudo chown -R "${USER}:www-data" storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

log "Reloading PHP-FPM and Nginx..."
PHP_FPM_SERVICE="$(systemctl list-units --type=service --all --no-legend 'php*-fpm.service' | awk '{print $1}' | head -n1)"
if [[ -z "${PHP_FPM_SERVICE}" ]]; then
  PHP_FPM_SERVICE="php${PHP_VERSION}-fpm"
fi
sudo systemctl reload "${PHP_FPM_SERVICE}"
sudo systemctl reload nginx

log "Deploy complete — $(git rev-parse --short HEAD) ($(git log -1 --pretty=format:'%s'))"
