# Tranquilo Hurghada Deployment Guide

Complete step-by-step guide to deploy the Tranquilo Hurghada luxury resort booking platform on Ubuntu VPS with Docker, SSL, and production configuration.

## 🖥️ System Setup

### 1. Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Dependencies
```bash
# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo apt install docker-compose -y

# Install Git
sudo apt install git -y

# Install Nginx & Certbot for SSL
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 3. Add Swap Memory (for small VPS)
```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 📁 Project Setup

### 4. Clone Repository
```bash
cd ~
git clone https://github.com/AchrafELGhazi/tranquilo-hurghada.git app
cd app
```

### 5. Configure Environment Variables

**Create Server Environment File:**
```bash
nano server/.env
```
**Paste this content (Ctrl+A to select all, Delete, then paste):**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret_key
LOG_LEVEL=debug
FRONTEND_URL=https://tranquilo-hurghada.com
API_VERSION=v1
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SALT_ROUNDS=10
ADMIN_EMAIL=admin@tranquilo-hurghada.com
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Tranquilo Hurghada
SMTP_PORT=587
SMTP_USER=your_email
SMTP_FROM=your_email
SMTP_PASS=your_email_password
PROD_URL=https://tranquilo-hurghada.com
```
**Save and exit: Ctrl+O, Enter, Ctrl+X**

**Create Frontend Environment File:**
```bash
nano web/.env
```
**Paste this content:**
```env
VITE_API_URL=/api
```
**Save and exit: Ctrl+O, Enter, Ctrl+X**

## 🐳 Docker Configuration

### 6. Docker Compose Setup
```bash
nano docker-compose.yml
```
**Replace content with (Ctrl+A, Delete, then paste):**
```yaml
services:
  server:
    build: ./server
    container_name: tranquilo_server
    restart: unless-stopped
    env_file:
      - ./server/.env
    ports:
      - "5000:5000"
  
  web:
    build: ./web
    container_name: tranquilo_web
    restart: unless-stopped
    ports:
      - "8080:80"
    depends_on:
      - server
```
**Save and exit: Ctrl+O, Enter, Ctrl+X**

### 7. Nginx Configuration
```bash
nano web/nginx.conf
```
**Replace content with (Ctrl+A, Delete, then paste):**
```nginx
server {
    listen 80;
    server_name tranquilo-hurghada.com www.tranquilo-hurghada.com;
    
    # Serve frontend static files
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy /api requests to backend
    location /api/ {
        proxy_pass http://tranquilo_server:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
**Save and exit: Ctrl+O, Enter, Ctrl+X**

### 8. Update Server Dockerfile
```bash
nano server/Dockerfile
```
**Find the line `RUN npm prune --production` and change it to:**
```dockerfile
RUN npm prune --omit=dev
```
**Save and exit: Ctrl+O, Enter, Ctrl+X**

**Complete Dockerfile should look like:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

## 🚀 Build & Deploy

### 9. Build Docker Containers
```bash
# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs
```

### 10. Test Docker Setup
```bash
# Test frontend
curl http://localhost:8080

# Test API
curl http://localhost:8080/api/health

# Test direct backend
curl http://localhost:5000/health
```

## 🔒 SSL Configuration

### 11. Setup SSL Certificate
```bash
# Stop system nginx if running
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot --nginx -d tranquilo-hurghada.com -d www.tranquilo-hurghada.com
```

### 12. Configure System Nginx
```bash
sudo nano /etc/nginx/sites-enabled/tranquilo
```
**Replace entire content with (Ctrl+A, Delete, then paste):**
```nginx
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name tranquilo-hurghada.com www.tranquilo-hurghada.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl;
    server_name tranquilo-hurghada.com www.tranquilo-hurghada.com;
    
    ssl_certificate /etc/letsencrypt/live/tranquilo-hurghada.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tranquilo-hurghada.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Proxy to Docker containers
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
**Save and exit: Ctrl+O, Enter, Ctrl+X**

### 13. Start System Nginx
```bash
# Test nginx configuration
sudo nginx -t

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## ✅ Final Testing

### 14. Verify Deployment
```bash
# Test HTTPS
curl -k https://localhost

# Check container status
docker-compose ps

# View logs
docker-compose logs --tail=20

# Test DNS resolution
nslookup tranquilo-hurghada.com
```

### 15. Access Your Application
- **Website**: https://tranquilo-hurghada.com
- **Admin Panel**: https://tranquilo-hurghada.com/admin
- **API Health**: https://tranquilo-hurghada.com/api/health

## 🔧 Maintenance Commands

### Useful Commands
```bash
# Restart containers
docker-compose restart

# View logs
docker-compose logs -f

# Update containers
docker-compose down
git pull
docker-compose up -d --build

# Check SSL certificate expiry
sudo certbot certificates

# Renew SSL (auto-renewal is configured)
sudo certbot renew
```

## 🌐 Architecture Overview

```
Internet → CloudFlare/DNS → VPS Server
    ↓
System Nginx (SSL Termination, Port 443)
    ↓
Docker Nginx (Port 8080 → 80)
    ↓ /api/* requests
Backend Server (Port 5000)
    ↓
Supabase Database
```

## 🎉 Deployment Complete!

Your Tranquilo Hurghada luxury resort booking platform is now live at:
**https://tranquilo-hurghada.com**

- ✅ SSL-secured with auto-renewal
- ✅ Dockerized for easy scaling
- ✅ Production-ready configuration
- ✅ Automated deployments ready