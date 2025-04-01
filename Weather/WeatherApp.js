const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeather API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';

document.getElementById('getWeather').addEventListener('click', async () => {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
});

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <div class="weather-container">
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
}

// Add responsive styles
document.head.insertAdjacentHTML('beforeend', 
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f0f0f0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 90%;
        }
        input, button {
            padding: 10px;
            margin: 10px 0;
            width: calc(100% - 20px);
        }
        .weather-container {
            margin-top: 20px;
            background: #007BFF;
            color: white;
            padding: 15px;
            border-radius: 8px;
        }
        @media (max-width: 600px) {
            .container {
                width: 95%;
            }
        }
    </style>
);

document.body.insertAdjacentHTML('afterbegin', `
    <div class="container">
        <h1>Weather App</h1>
        <input type="text" id="city" placeholder="Enter city name">
        <button id="getWeather">Get Weather</button>
        <div id="weatherInfo"></div>
    </div>
`);
