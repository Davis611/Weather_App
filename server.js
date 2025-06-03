const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 4000;

const apiKey = 'bf37682db9d0aaf34d53109974ae4c08'; // Keep this secret!

app.use(cors());

app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;
    let apiUrl;
    if (city) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        return res.status(400).json({ error: 'City or lat/lon required' });
    }
    try {
        console.log('Fetching:', apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenWeather error:', response.status, errorText);
            return res.status(response.status).json({ error: errorText });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});

app.get('/forecast', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch forecast' });
    }
});

app.get('/air', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch air quality' });
    }
});

app.get('/uvi', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch UV index' });
    }
});

app.get('/', (req, res) => {
    res.send('Weather API Proxy is running.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));