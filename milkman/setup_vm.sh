#!/bin/bash

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Python 3, venv, Node.js, and Nginx
sudo apt install -y python3-pip python3-venv nginx nodejs npm curl git

# 3. Install PM2 globally
sudo npm install -g pm2

# 4. Create project directory if it doesn't exist
mkdir -p ~/milkman

# 5. Setup Nginx
sudo rm /etc/nginx/sites-enabled/default
sudo touch /etc/nginx/sites-available/milkman
sudo ln -sf /etc/nginx/sites-available/milkman /etc/nginx/sites-enabled/

# 6. Open Firewall for HTTP
sudo ufw allow 'Nginx Full'

echo "======================================================"
echo "VM SETUP COMPLETED!"
echo "Now you should:"
echo "1. Clone your repository to ~/milkman"
echo "2. Set up GitHub Secrets: AZURE_VM_HOST, AZURE_VM_USER, AZURE_VM_SSH_KEY"
echo "3. Push your changes to trigger the GitHub Actions deployment"
echo "======================================================"
