#!/bin/bash
# Script to generate Let's Encrypt SSL Certificates for Production Domain

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: ./setup-ssl.sh <your-domain.com> <your-email@example.com>"
    exit 1
fi

echo "🔒 Requesting SSL Certificate for $DOMAIN..."

sudo apt update
sudo apt install -y certbot python3-certbot-nginx

sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos -m $EMAIL

echo "✅ SSL Certificate successfully issued!"
echo "Certificate path: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "Key path: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
