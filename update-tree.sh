#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Updating Tree on a Truck from GitHub..."
cd "$SCRIPT_DIR"

echo "Pulling latest changes..."
git pull

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Rebuilding frontend..."
npm run build

echo "Installing backend dependencies..."
cd ../backend
npm install
cd ..

echo "Restarting services..."
sudo systemctl restart tree-backend
sudo systemctl restart tree-frontend

echo "Update complete! Tree on a Truck restarted."
echo "Refresh will happen automatically in the browser."
