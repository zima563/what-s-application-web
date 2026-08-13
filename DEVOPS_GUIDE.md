# 🛠️ Senior DevOps Deployment & Automation Guide

This guide details the complete production deployment pipeline for the **WhatsApp Web Microservices Application**.

---

## 🏗️ DevOps Components Created

1. **[CI/CD Pipeline](file:///.github/workflows/ci-cd.yml)** (`.github/workflows/ci-cd.yml`): Automatically tests code, builds Docker images, pushes to GHCR, and deploys to server via SSH on every push to `main`.
2. **[Production Docker Compose](file:///docker-compose.prod.yml)** (`docker-compose.prod.yml`): Container orchestration with built-in healthchecks, memory caps, log rotation, and restart policies.
3. **[Production Nginx Gateway](file:///gateway/nginx.prod.conf)** (`gateway/nginx.prod.conf`): Hardened Nginx proxy with Rate Limiting (15 req/s), SSL support, Gzip compression, and security headers.
4. **[SSL Setup Script](file:///scripts/setup-ssl.sh)** (`scripts/setup-ssl.sh`): Automated Let's Encrypt SSL certificate generator.

---

## 🔑 GitHub Actions Secrets Setup

To enable automated deployment on `git push`, add these Secrets in your GitHub Repo (`Settings > Secrets and variables > Actions > New repository secret`):

| Secret Name | Value Description |
| :--- | :--- |
| `SERVER_HOST` | Public IP address of your VPS (e.g., `159.65.12.34`) |
| `SERVER_USER` | Server SSH username (e.g., `root` or `ubuntu`) |
| `SSH_PRIVATE_KEY` | Private SSH Key (`~/.ssh/id_rsa`) to log into your server |

---

## 🌐 Production Server Setup (VPS Step-by-Step)

### Step 1: Initial Server Setup
SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Clone the repository into `/var/www/whatsapp-app`:
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git whatsapp-app
cd whatsapp-app
```

### Step 2: Issue Free SSL Certificate
Run the setup SSL script with your domain:
```bash
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh yourdomain.com admin@yourdomain.com
```

### Step 3: Launch Production Cluster
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Healthchecks & Monitoring

Check container health status anytime:
```bash
docker compose -f docker-compose.prod.yml ps
```

View live aggregated logs across microservices:
```bash
docker compose -f docker-compose.prod.yml logs -f --tail=100
```
