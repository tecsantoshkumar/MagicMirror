
const LAT = 28.7041;
const LON = 77.1025;

// Update time and date
function updateDateTime() {
  const now = new Date();

  // Time with seconds
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  document.getElementById('timeDisplay').innerHTML =
    `${hours}:${minutes}<span class="time-seconds">${seconds}</span>`;

  // Small time in weather section
  const displayHours = now.getHours() % 12 || 12;
  const displayMinutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('currentTime').textContent =
    `${displayHours.toString().padStart(2, '0')}:${displayMinutes}`;

  // Date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('dateHeader').textContent =
    now.toLocaleDateString('en-US', options);
}

// Weather icons mapping
function getWeatherIcon(code) {
  const iconMap = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️',
    80: '🌧️', 81: '🌧️', 82: '🌧️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  return iconMap[code] || '☁️';
}

// Load weather from Open-Meteo
async function loadWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=celsius&forecast_days=5`;

    const response = await fetch(url);
    const data = await response.json();

    // Current weather
    const current = data.current;
    const temp = Math.round(current.temperature_2m * 10) / 10;
    const feelsLike = Math.round(current.apparent_temperature * 10) / 10;

    document.getElementById('temperature').textContent = `${temp}°`;
    document.getElementById('feelsLike').textContent = `Feels like ${feelsLike}°`;

    // Forecast
    const daily = data.daily;
    const forecastHTML = [];
    const dayNames = ['Today', 'Tomorrow', 'Mon', 'Tue', 'Wed'];

    for (let i = 0; i < 5; i++) {
      const maxTemp = Math.round(daily.temperature_2m_max[i] * 10) / 10;
      const minTemp = Math.round(daily.temperature_2m_min[i] * 10) / 10;
      const icon = getWeatherIcon(daily.weather_code[i]);

      forecastHTML.push(`
            <div class="forecast-day">
              <span class="forecast-name">${dayNames[i]}</span>
              <span class="forecast-icon">${icon}</span>
              <span class="forecast-temps">
                <span>${maxTemp}°</span>
                <span class="forecast-temp-low">${minTemp}°</span>
              </span>
            </div>
          `);
    }

    document.getElementById('forecastList').innerHTML = forecastHTML.join('');

  } catch (error) {
    console.error('Weather error:', error);
  }
}

// --- INDIA HOLIDAYS ---
async function loadHolidays() {
  const res = await fetch("/api/holidays");
  const holidays = await res.json();
  const list = document.getElementById("holidayList");
  list.innerHTML = "";

  holidays.forEach((h, i) => {
    const dateObj = new Date(h.date);
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const day = dateObj.getDate();
    const weekday = dateObj.toLocaleString("en-US", { weekday: "short" });
    const formatted = `${month} ${day}`;

    const li = document.createElement("li");
    li.className = "holiday-item";
    li.innerHTML = `
      <div class="holiday-checkbox"></div>
      <span class="holiday-name">${h.title}</span>
      <span class="holiday-date">${weekday} ${formatted}</span>
    `;
    list.appendChild(li);
  });
}
loadHolidays();

// Initialize
updateDateTime();
setInterval(updateDateTime, 1000);

loadWeather();
setInterval(loadWeather, 10 * 60 * 1000); // Update every 10 minutes