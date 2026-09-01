#!/usr/bin/env bash
#
# One-time EC2 server provisioning for Pintu Dua Coffeehouse.
# Run on a fresh Ubuntu 22.04/24.04/26.04 instance as a user with sudo access:
#   curl -fsSL <raw-url>/deploy/ec2/setup-server.sh | bash
# Or after cloning:
#   sudo bash deploy/ec2/setup-server.sh
#
set -euo pipefail

# ── Configuration (override via environment) ──────────────────────────────────
APP_NAME="${APP_NAME:-pintu-dua-coffeehouse}"
APP_DIR="${APP_DIR:-/var/www/${APP_NAME}}"
APP_USER="${APP_USER:-ubuntu}"
DOMAIN="${DOMAIN:-_}"
REPO_URL="${REPO_URL:-https://github.com/dfanggara/pintu-dua-coffeehouse.git}"
BRANCH="${BRANCH:-main}"
DB_NAME="${DB_NAME:-pintu_dua}"
DB_USER="${DB_USER:-pintu_dua}"
DB_PASS="${DB_PASS:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)}"
PHP_VERSION="${PHP_VERSION:-8.3}"
NODE_MAJOR="${NODE_MAJOR:-22}"

# ── Helpers ───────────────────────────────────────────────────────────────────
log() { echo "[setup] $*"; }
require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    echo "Run as root: sudo bash $0" >&2
    exit 1
  fi
}

install_php_repository() {
  local candidates=("${PHP_VERSION}" 8.5 8.4 8.3)
  local unique_candidates=()
  local seen=""
  local version

  for version in "${candidates[@]}"; do
    [[ " ${seen} " == *" ${version} "* ]] && continue
    seen="${seen} ${version}"
    unique_candidates+=("${version}")
  done

  for version in "${unique_candidates[@]}"; do
    if apt-cache show "php${version}-fpm" &>/dev/null; then
      PHP_VERSION="${version}"
      log "PHP ${PHP_VERSION} found in APT repositories."
      return
    fi
  done

  install_sury_php_repository

  for version in "${unique_candidates[@]}"; do
    if apt-cache show "php${version}-fpm" &>/dev/null; then
      PHP_VERSION="${version}"
      log "PHP ${PHP_VERSION} found via packages.sury.org."
      return
    fi
  done

  echo "No suitable PHP version found (need >= 8.3). Check 'apt-cache search php-fpm'." >&2
  exit 1
}

install_sury_php_repository() {
  log "Adding packages.sury.org PHP repository..."
  apt-get install -y -qq lsb-release ca-certificates curl
  curl -fsSL -o /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb
  dpkg -i /tmp/debsuryorg-archive-keyring.deb
  echo "deb [signed-by=/usr/share/keyrings/debsuryorg-archive-keyring.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" \
    > /etc/apt/sources.list.d/php-sury.list
  apt-get update -qq
}

remove_legacy_ondrej_php_ppa() {
  if grep -rq 'ondrej/php\|launchpadcontent.net/ondrej/php' /etc/apt/ 2>/dev/null; then
    log "Removing legacy ondrej/php Launchpad PPA (not supported on Ubuntu 26.04+)..."
    apt-get install -y -qq software-properties-common 2>/dev/null || true
    add-apt-repository -y --remove ppa:ondrej/php 2>/dev/null || true
    rm -f /etc/apt/sources.list.d/ondrej-ubuntu-php-*.list \
          /etc/apt/sources.list.d/ondrej-ubuntu-php-*.sources 2>/dev/null || true
  fi
}

require_root

remove_legacy_ondrej_php_ppa

log "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

install_php_repository

log "Installing Nginx, MySQL, PHP ${PHP_VERSION}, and utilities..."
apt-get install -y -qq \
  nginx \
  mysql-server \
  "php${PHP_VERSION}-fpm" \
  "php${PHP_VERSION}-cli" \
  "php${PHP_VERSION}-mysql" \
  "php${PHP_VERSION}-xml" \
  "php${PHP_VERSION}-mbstring" \
  "php${PHP_VERSION}-curl" \
  "php${PHP_VERSION}-zip" \
  "php${PHP_VERSION}-gd" \
  "php${PHP_VERSION}-bcmath" \
  "php${PHP_VERSION}-intl" \
  "php${PHP_VERSION}-readline" \
  git \
  unzip \
  curl \
  acl

log "Installing Composer..."
if ! command -v composer >/dev/null 2>&1; then
  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

log "Installing Node.js ${NODE_MAJOR}..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y -qq nodejs
fi

log "Configuring MySQL database..."
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

log "Preparing application directory at ${APP_DIR}..."
mkdir -p "$(dirname "${APP_DIR}")"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone --branch "${BRANCH}" "${REPO_URL}" "${APP_DIR}"
else
  log "Repository already exists, pulling latest ${BRANCH}..."
  git -C "${APP_DIR}" fetch origin "${BRANCH}"
  git -C "${APP_DIR}" checkout "${BRANCH}"
  git -C "${APP_DIR}" pull origin "${BRANCH}"
fi

chown -R "${APP_USER}:www-data" "${APP_DIR}"
chmod -R 775 "${APP_DIR}/storage" "${APP_DIR}/bootstrap/cache" 2>/dev/null || true

log "Creating production .env..."
ENV_FILE="${APP_DIR}/.env"
if [[ ! -f "${ENV_FILE}" ]]; then
  cp "${APP_DIR}/deploy/ec2/env.production.example" "${ENV_FILE}"
  sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" "${ENV_FILE}"
  sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" "${ENV_FILE}"
  sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" "${ENV_FILE}"
  if [[ "${DOMAIN}" != "_" ]]; then
    sed -i "s|APP_URL=.*|APP_URL=https://${DOMAIN}|" "${ENV_FILE}"
  fi
  chown "${APP_USER}:www-data" "${ENV_FILE}"
  chmod 640 "${ENV_FILE}"
else
  log ".env already exists, skipping."
fi

log "Generating application key..."
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && php artisan key:generate --force"

log "Installing PHP dependencies..."
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && composer install --no-dev --optimize-autoloader --no-interaction"

log "Installing Node dependencies and building frontend..."
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && npm ci --ignore-scripts && npm run build"

log "Running database migrations..."
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && php artisan migrate --force"
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && php artisan db:seed --force" || true

log "Linking storage and caching config..."
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && php artisan storage:link --force"
sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && php artisan config:cache && php artisan route:cache && php artisan view:cache"

log "Configuring Nginx..."
sed "s|__APP_DIR__|${APP_DIR}|g; s|__DOMAIN__|${DOMAIN}|g; s|__PHP_VERSION__|${PHP_VERSION}|g" \
  "${APP_DIR}/deploy/nginx/pintu-dua-coffeehouse.conf" \
  > "/etc/nginx/sites-available/${APP_NAME}"
ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx "php${PHP_VERSION}-fpm" mysql
systemctl restart nginx "php${PHP_VERSION}-fpm" mysql

log "Allowing ${APP_USER} to reload services without password..."
cat > "/etc/sudoers.d/${APP_NAME}-deploy" <<EOF
${APP_USER} ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx
${APP_USER} ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload php${PHP_VERSION}-fpm
${APP_USER} ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
${APP_USER} ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart php${PHP_VERSION}-fpm
EOF
chmod 440 "/etc/sudoers.d/${APP_NAME}-deploy"

log ""
log "════════════════════════════════════════════════════════════"
log " Server setup complete!"
log " App path : ${APP_DIR}"
log " Database : ${DB_NAME}"
log " DB user  : ${DB_USER}"
log " DB pass  : ${DB_PASS}  (also saved in ${ENV_FILE})"
log ""
log " Next steps:"
log "  1. Point your domain DNS A-record to this EC2 public IP"
log "  2. Update APP_URL in ${ENV_FILE} if using a custom domain"
log "  3. Install SSL: sudo apt install certbot python3-certbot-nginx && sudo certbot --nginx -d yourdomain.com"
log "  4. Add GitHub Actions secrets (see deploy/README.md)"
log "  5. Change the default admin password after first login"
log "════════════════════════════════════════════════════════════"
