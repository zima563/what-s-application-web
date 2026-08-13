#!/bin/bash

# SSL Setup Script for WhatsApp Web Microservices
set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "=================================================="
    echo "  Generating Self-Signed SSL Certificate for IP"
    echo "=================================================="
    mkdir -p gateway/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout gateway/ssl/key.pem \
      -out gateway/ssl/cert.pem \
      -subj "/C=US/ST=State/L=City/O=WhatsApp/OU=IT/CN=3.66.219.100"
    echo "SSL Certificate generated successfully in gateway/ssl/"
else
    echo "=================================================="
    echo "  Setting up Let's Encrypt SSL for $DOMAIN"
    echo "=================================================="
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
    echo "Let's Encrypt SSL successfully configured for $DOMAIN!"
fi
