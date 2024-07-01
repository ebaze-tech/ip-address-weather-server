const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const OPENWEATHER_API_KEY = process.env.WEATHER_API;
const IPINFO_API_KEY = process.env.IPINFO_API_KEY;

app.get('/api/hello', async (req, res) => {
let visitorName = req.query.visitor_name || 'Guest';
visitorName = visitorName.replace(/['"]+/g, ''); //Remove quotes
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Making use of ipapi to get location and temperature
    const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}/json`, {
      headers: { 'Authorization': `Bearer ${IPINFO_API_KEY}` }
    });
    const { city } = locationResponse.data;

    // Making use of a weather API to get the temperature (OpenWeatherMap)
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${city}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch location or weather data.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})