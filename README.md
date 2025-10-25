# ![MagicMirror²: The open source modular smart mirror platform.](main_screen.png)

<p style="text-align: center">
  <a href="https://choosealicense.com/licenses/mit">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <img src="https://img.shields.io/github/actions/workflow/status/magicmirrororg/magicmirror/automated-tests.yaml" alt="GitHub Actions">
  <img src="https://img.shields.io/github/check-runs/magicmirrororg/magicmirror/master" alt="Build Status">
  <a href="https://github.com/tecsantoshkumar/MagicMirror">
    <img src="https://img.shields.io/github/stars/tecsantoshkumar/MagicMirror?style=social" alt="GitHub Stars">
  </a>
</p>

**MagicMirror²** is an open source modular smart mirror platform. With a growing list of installable modules, **MagicMirror²** allows you to turn your Raspberry Pi-powered mirror into a personal assistant, displaying news, weather, calendar events, and more. **MagicMirror²** is built by the creator of [the original MagicMirror](https://michaelteeuw.nl/tagged/magicmirror) with the help of a [growing community of contributors](https://github.com/tecsantoshkumar/MagicMirror/graphs/contributors).

MagicMirror² focuses on a modular plugin system and runs on **Raspberry Pi** using [Electron](https://www.electronjs.org/) as an application wrapper. No web server or browser installation is necessary—just boot your Pi and start your smart mirror!

---

## Raspberry Pi Installation & Setup

Follow these commands to install and start MagicMirror on Raspberry Pi or Ubuntu:

### 1️⃣ Clone your fork

```
git clone https://github.com/tecsantoshkumar/MagicMirror.git magic-mirror
cd MagicMirror
```

### 2️⃣ Clean old modules (if reinstalling)

```
rm -rf node_modules package-lock.json
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Copy sample config to create your own

```
cp config/config.js.sample config/config.js
```

### 5️⃣ Edit config.js for your location and preferences

```
nano config/config.js
```

### config.js

```
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

```

### Start in normal mode

```
npm run start
```

### Start in server-only mode (headless)

```
npm run start:serveronly
```

### Start MagicMirror on Boot (PM2)

```
sudo npm install -g pm2
pm2 start ~/magic-mirror/MagicMirror/serveronly
pm2 save
pm2 startup
```
