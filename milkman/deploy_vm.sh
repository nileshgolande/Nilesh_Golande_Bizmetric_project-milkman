#!/bin/bash
set -e

# Configuration
PROJECT_ROOT="/home/azureuser/milkman"
BACKEND_DIR="$PROJECT_ROOT/milkman"
FRONTEND_DIR="$PROJECT_ROOT/frontend/frontendfile"

echo "======================================================"
echo "DEPLOYING MILKMAN PROJECT..."
echo "======================================================"

# 1. Update from git
echo "Pulling latest code..."
cd $PROJECT_ROOT
git fetch origin
git reset --hard origin/main

# 2. Setup Backend (Django)
echo "Setting up Django backend..."
cd $BACKEND_DIR
mkdir -p static media staticfiles
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt gunicorn
python3 manage.py migrate
python3 manage.py collectstatic --noinput
deactivate

# 3. Setup Frontend (React)
echo "Setting up React frontend..."
cd $FRONTEND_DIR
npm install
npm run build

# 4. Configure Nginx
echo "Configuring Nginx..."
sudo mkdir -p /var/www/certbot
sudo cp $BACKEND_DIR/nginx.conf /etc/nginx/sites-available/milkman
sudo ln -sf /etc/nginx/sites-available/milkman /etc/nginx/sites-enabled/
# Ensure Nginx runs as azureuser for static file access
sudo sed -i 's/user www-data;/user azureuser;/g' /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx

# 5. Fix permissions for Nginx
echo "Fixing permissions..."
chmod +x /home/azureuser
chmod +x $PROJECT_ROOT
chmod -R 755 $FRONTEND_DIR/dist

# 6. Restart PM2 and cleanup
echo "Cleaning up old processes..."
# Kill anything on port 8000 (Django) or 5173 (old Vite)
sudo fuser -k 8000/tcp || true
sudo fuser -k 5173/tcp || true

echo "Restarting PM2 processes..."
cd $BACKEND_DIR
pm2 delete milkman-django || true
# pm2 delete milkman-react || true
pm2 flush # Clear old logs
pm2 start ecosystem.config.js
pm2 save

echo "======================================================"
echo "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "Frontend: http://milkmanauto.duckdns.org"
echo "Backend:  http://milkmanautoapi.duckdns.org"
echo "======================================================"
