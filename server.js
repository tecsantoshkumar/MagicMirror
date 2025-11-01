import express from "express";
import ical from "ical";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ================== APIs ==================
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";
const LAT = 28.6380, LON = 77.0710;

// app.get("/api/holidays", async (req, res) => {
//   try {
//     const url = "https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics";
//     const response = await fetch(url);
//     const icsData = await response.text();

//     const events = Object.values(ical.parseICS(icsData))
//       .filter(e => e.type === "VEVENT")
//       .map(e => ({
//         title: e.summary,
//         date: e.start
//       }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date))
//       .slice(0, 10); // only show top 10

//     res.json(events);
//   } catch (err) {
//     console.error("Holiday fetch error:", err);
//     res.status(500).json({ error: "Failed to load holidays" });
//   }
// });

// WEATHER API
app.get("/api/weather", async (req, res) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weather API error" });
  }
});

// DUMMY EVENTS (Replace with Google Calendar API later)
app.get("/api/events", (req, res) => {
  res.json([
    { title: "Team Meeting", date: "2025-11-01" },
    { title: "Festival Celebration", date: "2025-11-02" },
    { title: "Doctor Appointment", date: "2025-11-03" },
    { title: "Project Deadline", date: "2025-11-05" },
    { title: "Family Function", date: "2025-11-06" }
  ]);
});

// BIRTHDAYS API
app.get("/api/birthdays", (req, res) => {
  res.json([
    { name: "Jace", age: 9, daysLeft: 19 },
    { name: "Ananya", age: 23, daysLeft: 4 }
  ]);
});

app.get("/api/news", (req,res)=>{
  res.json({title: "India controls tap: Pak at 'acute risk' of water shortage - report"});
});

// ---- Weather: current + 5-day forecast ----
app.get("/api/weather", async (req, res) => {
  const lat = 28.6380, lon = 77.0710;
  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const [current, forecast] = await Promise.all([
    fetch(currentUrl).then(r=>r.json()),
    fetch(forecastUrl).then(r=>r.json())
  ]);
  res.json({ current, forecast });
});

// UPCOMING MOVIES API (TMDB example)
app.get("/api/movies", async (req, res) => {
  try {
    const TMDB_KEY = "YOUR_TMDB_API_KEY";
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=en-US&page=1`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data.results.slice(0, 5));
  } catch (e) {
    res.status(500).json({ error: "Movies API error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use("/smart-ui", express.static("node_modules/smart-webcomponents-community/source"));

app.listen(PORT, () => console.log(`✅ Dashboard running at http://localhost:${PORT}`));
