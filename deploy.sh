#!/bin/bash

# ============================================
# Task Management System - Deployment Script
# Server: naveen.hummingtone.com
# Domain: naveen.hummingtone.com
# ============================================

set -e

echo "=========================================="
echo "  Task Management System - Deployment"
echo "=========================================="

# Step 1: Install dependencies (if not already installed)
echo ""
echo "[1/6] Installing system dependencies..."
sudo apt update
sudo apt install -y nginx nodejs npm git

# Install PM2 globally
sudo npm install -g pm2

# Step 2: Clone or pull the repository
echo ""
echo "[2/6] Setting up project files..."
PROJECT_DIR="/var/www/task-management"

if [ -d "$PROJECT_DIR" ]; then
    echo "Project directory exists. Pulling latest changes..."
    cd $PROJECT_DIR
    git pull origin main
else
    echo "Cloning repository..."
    sudo mkdir -p /var/www
    sudo chown $USER:$USER /var/www
    git clone https://github.com/PravinKumar-M/Taskmangemant.git $PROJECT_DIR
    cd $PROJECT_DIR
fi

# Step 3: Setup Backend
echo ""
echo "[3/6] Setting up backend..."
cd $PROJECT_DIR/server
npm install

# Stop existing PM2 process if running
pm2 stop task-api 2>/dev/null || true
pm2 delete task-api 2>/dev/null || true

# Start backend with PM2
pm2 start server.js --name "task-api"
pm2 save

echo "Backend running on port 5000"

# Step 4: Build Frontend
echo ""
echo "[4/6] Building frontend..."
cd $PROJECT_DIR/client
npm install
npm run build

echo "Frontend built in dist/ folder"

# Step 5: Setup Nginx
echo ""
echo "[5/6] Configuring Nginx..."

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Copy nginx config
sudo cp $PROJECT_DIR/nginx.conf /etc/nginx/sites-available/task-management
sudo ln -sf /etc/nginx/sites-available/task-management /etc/nginx/sites-enabled/task-management

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "Nginx configured and running"

# Step 6: Setup PM2 to start on boot
echo ""
echo "[6/6] Setting up auto-start..."
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null || true
pm2 save

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""
echo "  Frontend: http://naveen.hummingtone.com"
echo "  API:      http://naveen.hummingtone.com/api"

echo ""
echo "  Useful commands:"
echo "    pm2 status        - Check backend status"
echo "    pm2 logs task-api - View backend logs"
echo "    pm2 restart task-api - Restart backend"
echo "    sudo systemctl status nginx - Check Nginx"
echo "=========================================="
