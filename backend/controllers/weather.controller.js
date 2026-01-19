import fetch from "node-fetch";
import CityWeather from "../models/CityWeather.model.js";



// 🔁 helper: group forecast by day
const groupByDay = (list) => {
  const days = {};
  list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = item;
  });
  return Object.values(days).slice(0, 7);
};

export const getWeatherForecast = async (req, res) => {
  try {
    const API_KEY = process.env.WEATHERAPI_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "Missing OpenWeather API key" });
    }

    const cityName = req.query.city || req.params.city;
    if (!cityName) {
      return res.status(400).json({ error: "City is required" });
    }

    const city = cityName.trim().toLowerCase();

    // 1️⃣ CHECK MONGODB CACHE (latest 30 min)
    const cached = await CityWeather.findOne({
      city,
      updatedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
    });

    if (cached) {
      return res.json({ source: "cache", ...cached._doc });
    }

    // 2️⃣ GEOCODING (FREE)
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon, name, country } = geoData[0];

    // 3️⃣ CURRENT WEATHER (FREE)
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const currentData = await currentRes.json();

    // 4️⃣ 5-DAY FORECAST (FREE)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastRes.json();
    const dailyForecast = groupByDay(forecastData.list);

    // 5️⃣ AIR QUALITY (FREE)
    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const airData = await airRes.json();

    const payload = {
      city,
      country,
      lat,
      lon,
      current: {
        temp: currentData.main.temp,
        humidity: currentData.main.humidity,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        weather: currentData.weather[0],
      },
      forecast: dailyForecast,
      airQuality: airData.list?.[0] || null
    };

    // 6️⃣ SAVE TO MONGODB
    await CityWeather.findOneAndUpdate(
      { city },
      payload,
      { upsert: true, new: true }
    );

    res.json({ source: "api", ...payload });

  } catch (err) {
    console.error("Weather Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
