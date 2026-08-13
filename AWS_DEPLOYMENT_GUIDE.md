# ☁️ AWS Deployment Guide: WhatsApp Microservices System

This guide covers deploying the **WhatsApp Web Microservices Application** on **Amazon Web Services (AWS)** using **AWS EC2, Docker Compose, Elastic IP, and Security Groups**.

---

## 🏗️ Architecture Overview on AWS

```
                           ┌──────────────────────────┐
                           │      Route 53 Domain     │
                           └────────────┬─────────────┘
                                        │ DNS (A Record)
                                        ▼
                           ┌──────────────────────────┐
                           │   AWS Elastic IP (Static)│
                           └────────────┬─────────────┘
                                        │
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                             AWS EC2 Instance                                │
 │                                                                             │
 │  ┌───────────────────────────────────────────────────────────────────────┐  │
 │  │                      Nginx API Gateway (Port 80/443)                  │  │
 │  └───────┬───────────────────────────┬───────────────────────────┬───────┘  │
 │          │                           │                           │          │
 │          ▼                           ▼                           ▼          │
 │   ┌──────────────┐            ┌──────────────┐            ┌──────────────┐  │
 │   │ Auth Service │            │ Chat Service │            │ Notification │  │
 │   │ (Port 5001)  │            │ (Port 5002)  │            │ (Port 5003)  │  │
 │   └──────┬───────┘            └──────┬───────┘            └──────┬───────┘  │
 │          │                           │                           │          │
 │          └───────────────────────────┼───────────────────────────┘          │
 │                                      ▼                                      │
 │                             ┌─────────────────┐                             │
 │                             │  MySQL 8.0 DB   │                             │
 │                             │   (Port 3306)   │                             │
 │                             └─────────────────┘                             │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Step 1: Create AWS EC2 Instance

1. Log into your **AWS Management Console**.
2. Go to **EC2 Console** > Click **Launch Instance**.
3. **Name**: `whatsapp-microservices-server`
4. **AMI (OS)**: Select **Ubuntu 22.04 LTS (64-bit Architecture)**.
5. **Instance Type**:
   - Testing: `t2.micro` or `t3.micro` (Free Tier eligible)
   - Production: `t3.medium` (2 vCPU, 4GB RAM - recommended for microservices).
6. **Key Pair**: Select or Create a new `.pem` SSH key pair (e.g. `whatsapp-key.pem`).
7. **Network Settings (Security Group Rules)**:
   Allow the following inbound traffic ports:
   - **SSH (22)**: Source `My IP` (for secure administration).
   - **HTTP (80)**: Source `0.0.0.0/0` (Anywhere).
   - **HTTPS (443)**: Source `0.0.0.0/0` (Anywhere).
   - **API Gateway (8000)**: Source `0.0.0.0/0` (Optional).
   - **Frontend App (3000)**: Source `0.0.0.0/0`.
8. Click **Launch Instance**.

---

## 📌 Step 2: Allocate AWS Elastic IP (Static Public IP)

1. In EC2 Dashboard, left sidebar > Click **Elastic IPs**.
2. Click **Allocate Elastic IP address** > Click **Allocate**.
3. Select the created Elastic IP > Actions > **Associate Elastic IP address**.
4. Choose your EC2 Instance `whatsapp-microservices-server` and associate it.

---

## 💻 Step 3: Connect & Setup Server Dependencies

Connect to your EC2 instance via SSH:

```bash
chmod 400 whatsapp-key.pem
ssh -i "whatsapp-key.pem" ubuntu@YOUR_ELASTIC_IP
```

Install Docker & Git on Ubuntu:

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to Docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Verify Docker Compose
docker compose version
```

---

## 🚀 Step 4: Clone & Run Project via Docker Compose

Clone your GitHub repository into `/var/www/whatsapp-app`:

```bash
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git whatsapp-app
cd whatsapp-app
```

Launch the complete microservices cluster in production mode:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Verify running containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

---

## 🔒 Step 5: Route53 Domain & Certbot SSL Setup

1. In **AWS Route 53** (or your Domain Registrar e.g. Namecheap/GoDaddy):
   - Add an **A Record**: `whatsapp.yourdomain.com` -> `YOUR_ELASTIC_IP`.
2. Issue free Let's Encrypt SSL:
   ```bash
   chmod +x scripts/setup-ssl.sh
   sudo ./scripts/setup-ssl.sh whatsapp.yourdomain.com admin@yourdomain.com
   ```

---

## 🤖 Step 6: Connect GitHub Actions CI/CD to AWS

Add these 3 Secrets in GitHub (`Settings > Secrets and variables > Actions`):

1. `SERVER_HOST`: `YOUR_ELASTIC_IP`
2. `SERVER_USER`: `ubuntu`
3. `SSH_PRIVATE_KEY`: Content of your `whatsapp-key.pem` file.

Now every `git push` to `main` will automatically build, test, and deploy to your AWS EC2 instance! 🎉
