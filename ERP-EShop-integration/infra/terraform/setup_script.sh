
#### Install deps
apt update

apt install nano htop curl bash-completion make git -y
apt install docker.io docker-compose -y

#### Firewall
apt install ufw -y
ufw default deny incoming
ufw default allow outgoing

ufw allow ssh
ufw allow 11000
ufw allow 11001
ufw allow 11002
ufw allow 11005
ufw enable --force

#### Orchesty
mkdir -p "/var/www"
git clone https://github.com/Orchesty/webinars.git /var/www
cd /var/www/ERP-EShop-integration
mv /tmp/.env .env
mv /tmp/start.sh start.sh
chmod +x start.sh
bash start.sh