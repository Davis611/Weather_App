document.getElementById('getWeather').addEventListener('click', async () => {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    try {
        console.log('Fetching weather for:', city);
        const response = await fetch(`http://localhost:4000/weather?city=${encodeURIComponent(city)}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Weather data:', data);
        if (!response.ok) {
            throw new Error('City not found');
        }
        displayWeather(data);
        setWeatherBackground(data.weather[0].main.toLowerCase());
        updateWeatherMap(data.coord.lat, data.coord.lon);
        fetchWeeklyForecast(data.coord.lat, data.coord.lon);
        fetchAirQuality(data.coord.lat, data.coord.lon);
        fetchUVIndex(data.coord.lat, data.coord.lon);
        displayWeatherTip(data.weather[0].main.toLowerCase());
        displayAlerts(data);
        
        // After displaying weather
        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML += `<button onclick="saveFavorite('${data.name}')">Save to Favorites</button>`;
    } catch (error) {
        alert(error.message);
        console.error(error);
    }
});

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherInfo.innerHTML = `
        <div class="weather-container">
            <img class="weather-icon" src="${iconUrl}" alt="${data.weather[0].description}">
            <h2>${data.name}, ${data.sys.country}</h2>
            <div class="temp">${Math.round(data.main.temp)}°C</div>
            <div class="desc">${data.weather[0].description}</div>
            <div class="details">
                <div>Humidity: ${data.main.humidity}%</div>
                <div>Wind: ${data.wind.speed} m/s</div>
            </div>
        </div>
    `;
}

function setWeatherBackground(weather) {
    const body = document.body;
    body.className = ''; // Reset
    document.getElementById('weather-effects').innerHTML = ''; // Clear effects

    if (weather.includes('clear')) {
        body.classList.add('sunny');
    } else if (weather.includes('cloud')) {
        body.classList.add('clouds');
    } else if (weather.includes('rain') || weather.includes('drizzle')) {
        body.classList.add('rain');
        createRain();
    } else if (weather.includes('thunderstorm')) {
        body.classList.add('thunderstorm');
        createRain();
        createThunder();
    } else if (weather.includes('snow')) {
        body.classList.add('snow');
        createSnow();
    } else if (weather.includes('mist') || weather.includes('fog') || weather.includes('haze')) {
        body.classList.add('mist');
    }
}

function createRain() {
    const effects = document.getElementById('weather-effects');
    for (let i = 0; i < 60; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDelay = (Math.random() * 0.7) + 's';
        effects.appendChild(drop);
    }
}

function createThunder() {
    const effects = document.getElementById('weather-effects');
    const thunder = document.createElement('div');
    thunder.className = 'thunder';
    effects.appendChild(thunder);
}

function createSnow() {
    const effects = document.getElementById('weather-effects');
    for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.animationDelay = (Math.random() * 3) + 's';
        effects.appendChild(flake);
    }
}

function updateWeatherMap(lat, lon) {
    // OpenWeatherMap Radar Layer (or use RainViewer as fallback)
    const mapUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=6&level=surface&overlay=rain&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=${lat}&detailLon=${lon}&metricWind=default&metricTemp=default&radarRange=-1`;
    document.getElementById('weatherMap').src = mapUrl;
}

async function fetchWeeklyForecast(lat, lon) {
    // You need to proxy this through your backend for API key protection!
    const response = await fetch(`http://localhost:4000/forecast?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    displayWeeklyForecast(data);
    displayHourlyForecast(data);
}

function displayWeeklyForecast(data) {
    const weeklyDiv = document.getElementById('weeklyForecast');
    if (!data || !data.list) {
        weeklyDiv.innerHTML = "<div>Weekly forecast unavailable.</div>";
        return;
    }
    // Group by day
    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        if (!days[day]) days[day] = [];
        days[day].push(item);
    });
    // Show up to 5 days
    weeklyDiv.innerHTML = Object.entries(days).slice(0, 5).map(([day, items]) => {
        const temps = items.map(i => i.main.temp);
        const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
        const icon = items[0].weather[0].icon;
        return `
            <div class="forecast-row">
                <span class="forecast-day">${day}</span>
                <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="">
                <span class="forecast-temp">${avgTemp}°C</span>
            </div>
        `;
    }).join('');
}

function displayHourlyForecast(data) {
    const hourlyDiv = document.getElementById('hourlyForecast');
    if (!data || !data.list) {
        hourlyDiv.innerHTML = "<div>Hourly forecast unavailable.</div>";
        return;
    }
    const hours = data.list.slice(0, 12);
    hourlyDiv.innerHTML = `
        <div style="font-weight:600;margin-bottom:8px;">Next 12 Hours</div>
        <div style="display:flex;overflow-x:auto;gap:12px;">
            ${hours.map(item => {
                const date = new Date(item.dt * 1000);
                const hour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `
                    <div style="flex:0 0 auto;text-align:center;">
                        <div>${hour}</div>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" width="36" height="36" alt="">
                        <div>${Math.round(item.main.temp)}°C</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

async function fetchAirQuality(lat, lon) {
    const res = await fetch(`http://localhost:4000/air?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    displayAirQuality(data);
}
function displayAirQuality(data) {
    const airDiv = document.getElementById('airQuality');
    if (!data || !data.list) {
        airDiv.innerHTML = '';
        return;
    }
    const aqi = data.list[0].main.aqi;
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    airDiv.innerHTML = `<div><b>Air Quality:</b> ${levels[aqi-1]}</div>`;
}

async function fetchUVIndex(lat, lon) {
    const res = await fetch(`http://localhost:4000/uvi?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    displayUVIndex(data);
}
function displayUVIndex(data) {
    const uvDiv = document.getElementById('uvIndex');
    if (!data || !data.value) {
        uvDiv.innerHTML = '';
        return;
    }
    uvDiv.innerHTML = `<div><b>UV Index:</b> ${data.value}</div>`;
}

function displayWeatherTip(weather) {
    const tipDiv = document.getElementById('weatherTip');
    let tip = '';
    if (weather.includes('rain')) tip = "Take an umbrella!";
    else if (weather.includes('snow')) tip = "Dress warmly and drive safe!";
    else if (weather.includes('clear')) tip = "Enjoy the sunshine!";
    else if (weather.includes('cloud')) tip = "A calm day ahead.";
    else if (weather.includes('thunderstorm')) tip = "Stay indoors if possible!";
    else tip = "Check the forecast for updates.";
    tipDiv.innerHTML = `<div style="margin-top:10px;font-style:italic;">${tip}</div>`;
}

function displayAlerts(data) {
    const alertDiv = document.getElementById('alerts');
    if (data && data.alerts && data.alerts.length) {
        alertDiv.innerHTML = data.alerts.map(a => 
            `<div style="background:#ffbaba;color:#900;padding:8px;border-radius:8px;margin:8px 0;">
                <b>${a.event}</b>: ${a.description}
            </div>`
        ).join('');
    } else {
        alertDiv.innerHTML = '';
    }
}

document.getElementById('darkModeToggle').onclick = () => {
    document.body.classList.toggle('dark');
};

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            // Fetch weather by coordinates
            const res = await fetch(`http://localhost:4000/weather?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            displayWeather(data);
            setWeatherBackground(data.weather[0].main.toLowerCase());
            updateWeatherMap(lat, lon);
            fetchWeeklyForecast(lat, lon);
            fetchAirQuality(lat, lon);
            fetchUVIndex(lat, lon);
            displayWeatherTip(data.weather[0].main.toLowerCase());
            displayAlerts(data);
        });
    }
};

function saveFavorite(city) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favs.includes(city)) {
        favs.push(city);
        localStorage.setItem('favorites', JSON.stringify(favs));
        displayFavorites();
    }
}
function displayFavorites() {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favDiv = document.getElementById('favorites');
    favDiv.innerHTML = favs.length ? 
        `<div style="margin:10px 0;">Favorites: ${favs.map(c => `<button onclick="fetchWeatherByCity('${c}')">${c}</button>`).join(' ')}</div>` : '';
}
function fetchWeatherByCity(city) {
    document.getElementById('city').value = city;
    document.getElementById('getWeather').click();
}
window.displayFavorites = displayFavorites;
window.fetchWeatherByCity = fetchWeatherByCity;
displayFavorites();