# AWS EC2 Deployment

Deploy the full stack (React client, Laravel backend, MySQL database) to a single EC2 instance.

## Architecture

```
Internet
   │
   ▼
Nginx (port 80/443)
   ├── /build/*          → React assets (Vite build)
   ├── /storage/*        → Uploaded images
   └── /*                → Laravel (PHP-FPM) + Inertia.js
                              │
                              ▼
                         MySQL (localhost)
```

All three layers run on one EC2 instance. The React client is built during deploy (`npm run build`) and served as static files by Nginx/Laravel — no separate frontend server is needed.

## Prerequisites

- AWS EC2 instance (Ubuntu 22.04 or 24.04 recommended, `t3.small` or larger)
- Security group allowing inbound **22** (SSH), **80** (HTTP), and **443** (HTTPS)
- A GitHub repository with this code
- SSH key pair for EC2 access

## 1. Launch EC2

1. Create an EC2 instance (Ubuntu 22.04/24.04 LTS).
2. Attach or create a key pair and note the public IP.
3. Open security group ports: **22**, **80**, **443**.

## 2. One-time server setup

SSH into the instance and run the setup script:

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Clone the repo first (setup script needs deploy/ files)
sudo git clone https://github.com/dfanggara/pintu-dua-coffeehouse.git /var/www/pintu-dua-coffeehouse
cd /var/www/pintu-dua-coffeehouse
sudo bash deploy/ec2/setup-server.sh
```

Optional environment variables before running setup:

```bash
sudo DOMAIN=yourdomain.com \
     REPO_URL=https://github.com/dfanggara/pintu-dua-coffeehouse.git \
     bash deploy/ec2/setup-server.sh
```

The script installs and configures:

| Component | Details |
|-----------|---------|
| **Nginx** | Web server, reverse proxy to PHP-FPM |
| **PHP 8.3** | Laravel backend with required extensions |
| **MySQL 8** | Database (`pintu_dua` database + user) |
| **Node.js 22** | Builds the React client during deploy |
| **Composer** | PHP dependency manager |

Save the database password printed at the end of setup.

### SSL (recommended)

After pointing your domain DNS to the EC2 IP:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Then update `APP_URL` in `/var/www/pintu-dua-coffeehouse/.env`.

## 3. Configure GitHub Actions secrets

In your GitHub repo go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description | Example |
|--------|-------------|---------|
| `EC2_HOST` | EC2 public IP or domain | `54.123.45.67` |
| `EC2_USER` | SSH username | `ubuntu` |
| `EC2_SSH_PRIVATE_KEY` | Full contents of your `.pem` key file | `-----BEGIN RSA PRIVATE KEY-----...` |
| `EC2_SSH_PORT` | (optional) SSH port | `22` |
| `EC2_APP_PATH` | (optional) App directory | `/var/www/pintu-dua-coffeehouse` |

Also create a **production** environment in GitHub (Settings → Environments → New environment) named `production` to gate deployments.

## 4. Automatic deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which:

1. SSHs into the EC2 instance
2. Runs `deploy/ec2/deploy.sh`
3. Verifies the app responds on `http://127.0.0.1/`

You can also trigger a deploy manually from the **Actions** tab → **Deploy to AWS EC2** → **Run workflow**.

### What deploy.sh does

```bash
git pull origin/main
composer install --no-dev
npm ci && npm run build      # builds React client
php artisan migrate --force  # updates MySQL schema
php artisan config/route/view cache
reload php-fpm + nginx
```

## 5. Manual deployment

```bash
ssh ubuntu@<EC2_PUBLIC_IP>
bash /var/www/pintu-dua-coffeehouse/deploy/ec2/deploy.sh
```

## Post-deploy checklist

- [ ] Change default admin password (`admin@pintudua.com` / `password123` from seeder)
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Configure real `APP_URL` with your domain
- [ ] Set up SSL with Certbot
- [ ] Configure automated MySQL backups (e.g. cron + `mysqldump`)

## Troubleshooting

**Deploy fails on `composer install`**
```bash
cd /var/www/pintu-dua-coffeehouse
composer install --no-dev
```

**Permission errors on storage**
```bash
sudo chown -R ubuntu:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

**Check Laravel logs**
```bash
tail -f /var/www/pintu-dua-coffeehouse/storage/logs/laravel.log
```

**Check Nginx / PHP-FPM**
```bash
sudo nginx -t
sudo systemctl status nginx php8.3-fpm mysql
```

**Database connection issues**
```bash
mysql -u pintu_dua -p pintu_dua
# Verify credentials match .env
```
