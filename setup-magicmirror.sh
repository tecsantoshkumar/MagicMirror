#!/bin/bash

# -------------------------------------------
# MagicMirror² Setup Script for Raspberry Pi
# Author: tecsantoshkumar
# -------------------------------------------

# Exit on error
set -e

echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "⬇️ Installing curl and build tools..."
sudo apt install -y curl build-essential git

echo "⬇️ Installing Node.js 20.x LTS (includes npm)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

echo "⬇️ Cloning MagicMirror repository..."
cd ~
if [ ! -d "magic-mirror" ]; then
  git clone https://github.com/tecsantoshkumar/MagicMirror.git magic-mirror
else
  echo "📁 magic-mirror folder already exists, skipping clone..."
fi
cd magic-mirror

echo "🧹 Cleaning old modules..."
rm -rf node_modules package-lock.json

echo "⬇️ Installing MagicMirror dependencies..."
npm install

echo "📄 Copying sample config..."
cp config/config.js.sample config/config.js

echo "✏️ Updating config.js for New Delhi, India..."
cat > config/config.js <<EOL
let config = {
    address: "localhost",
    port: 8080,
    basePath: "/",
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
    useHttps: false,
    language: "en",
    locale: "en-IN",
    logLevel: ["INFO", "LOG", "WARN", "ERROR"],
    timeFormat: 24,
    units: "metric",

    modules: [
        { module: "alert" },
        { module: "updatenotification", position: "top_bar" },
        { module: "clock", position: "top_left" },
        {
            module: "calendar",
            header: "India Holidays",
            position: "top_left",
            config: {
                calendars: [
                    {
                        fetchInterval: 7 * 24 * 60 * 60 * 1000,
                        symbol: "calendar-check",
                        url: "https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics"
                    }
                ]
            }
        },
        {
            module: "weather",
            position: "top_right",
            config: { weatherProvider: "openmeteo", type: "current", lat: 28.6380, lon: 77.0710 }
        },
        {
            module: "weather",
            position: "top_right",
            header: "Weather Forecast",
            config: { weatherProvider: "openmeteo", type: "forecast", lat: 28.6380, lon: 77.0710 }
        },
        {
            module: "newsfeed",
            position: "bottom_bar",
            config: {
                feeds: [
                    { title: "Times of India - Top Stories", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms" },
                    { title: "NDTV - Latest News", url: "https://feeds.feedburner.com/ndtvnews-top-stories" }
                ],
                showSourceTitle: true,
                showPublishDate: true,
                broadcastNewsFeeds: true,
                broadcastNewsUpdates: true
            }
        }
    ]
};

if (typeof module !== "undefined") { module.exports = config; }
EOL

echo "⬇️ Installing PM2 for auto-start..."
sudo npm install -g pm2
pm2 start ~/magic-mirror/MagicMirror/serveronly
pm2 save
pm2 startup

echo "🎉 MagicMirror² setup completed!"
echo "➡️ Start MagicMirror manually: npm run start"
echo "➡️ Server-only mode (headless): npm run start:serveronly"
