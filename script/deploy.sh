#!/bin/bash

# Update
git pull
npm prune
npm install

# Build
npm run build
cp package.json build/

# Install
cd build
npm install --only=production
rm *.json
cd ..

# Migrate
npm run migrate
mkdir -p dist

# Backup
if [ -d dist/current ]; then
	mv dist/current dist/$(date -u +%Y%m%d_%H%M%S_%N);
fi

# Swap
mv build dist/current

# Reload
pm2 startOrReload pm2.json --update-env
