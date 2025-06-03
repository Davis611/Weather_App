# Atmo

A sleek, responsive weather dashboard built with HTML, CSS, and JavaScript, powered by a Node.js/Express backend proxy for secure API access.  
Features include current weather, hourly and weekly forecasts, air quality, UV index, weather-based tips, dark mode, animated backgrounds, location auto-detect, favorite cities, and severe weather alerts.

---

## Features

- **Current Weather**: Real-time weather for any city or your current location.
- **Hourly Forecast**: Next 12 hours, with icons and temperature.
- **Weekly Forecast**: 5-day forecast, grouped by day.
- **Air Quality Index**: Shows air quality level.
- **UV Index**: Displays current UV index.
- **Weather Tips**: Smart suggestions based on current weather.
- **Dark Mode**: Toggle for a night-friendly interface.
- **Animated Weather Backgrounds**: Rain, snow, thunderstorm, and more.
- **Location Auto-Detect**: Uses your device location (with permission).
- **Favorite Cities**: Save and quickly access your favorite locations.
- **Severe Weather Alerts**: Displays alerts if available.

---



### 2. Install Backend Dependencies

```sh
npm install express node-fetch cors
```

### 3. Configure API Key

- Open `server.js`
- Replace the `apiKey` value with your [OpenWeatherMap](https://openweathermap.org/api) API key.

### 4. Start the Backend

```sh
node server.js
```
The backend runs on [http://localhost:](http://localhost:).

### 5. Open the Frontend

- Open `Weather/index.html` in your browser.
- Or use a local server (e.g., Live Server extension in VS Code).

---

## Usage

1. Enter a city name and click **Get Weather**.
2. Or, allow location access for automatic weather.
3. Toggle dark mode, save favorite cities, and explore forecasts and tips.

---

## Project Structure

```
Weather_App/
├── Weather/
│   ├── index.html
│   ├── WeatherApp.css
│   └── WeatherApp.js
└── server.js
```

---

## Customization & Extensions

- **Animated Weather Icons**: Swap OpenWeather icons for animated SVGs or Lottie files.
- **More Data**: Add humidity, wind direction, sunrise/sunset, etc.
- **PWA Support**: Make it installable on mobile.
- **Unit Toggle**: Switch between Celsius and Fahrenheit.

---

## License

MIT

---

## Credits

- [OpenWeatherMap API](https://openweathermap.org/api)
- Weather icon assets from OpenWeatherMap

---
