#!/bin/bash
# Start the Magic Mirror dashboard server
cd ~/magic-mirror/custom\ magic\ mirror/simple-web-app
npm start &
sleep 2

# Launch Chrome in kiosk (fullscreen) mode with a temporary profile
google-chrome --noerrdialogs --disable-infobars --kiosk \
--app=http://localhost:3000 \
--user-data-dir=/tmp/magicmirror-profile \
--new-window &
