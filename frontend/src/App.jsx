import { useState, useEffect } from "react";
import SearchCity from "./components/SearchCity";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/Forecast";
import SunTimeline from "./components/SunTimeLine";

export default function App() {
  const [city, setCity] = useState("Chandigarh");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState(null);
  const [bgClass, setBgClass] = useState("from-blue-400 to-blue-800");

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setWeather(data.current);
      setForecast(data.forecast || []);
      setLocation({ city: data.city, country: data.country });

      const mainWeather = data.current?.weather?.main?.toLowerCase();

      switch (mainWeather) {
        case "clear":
          setBgClass("from-sky-300 via-sky-400 to-blue-600");
          break;
        case "clouds":
          setBgClass("from-gray-300 via-gray-400 to-gray-600");
          break;
        case "rain":
        case "drizzle":
          setBgClass("from-slate-700 via-slate-800 to-black");
          break;
        case "thunderstorm":
          setBgClass("from-indigo-900 via-purple-900 to-black");
          break;
        case "snow":
          setBgClass("from-blue-100 via-blue-200 to-blue-300");
          break;
        case "mist":
        case "fog":
        case "haze":
          setBgClass("from-gray-200 via-gray-300 to-gray-400");
          break;
        default:
          setBgClass("from-blue-400 to-blue-800");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b transition-all duration-1000 ${bgClass}`}
    >
      {/* 🌍 PAGE WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center min-h-screen">

        {/* 🔍 SEARCH – TOP */}
        <div className="w-full flex justify-center">
          <SearchCity onSearch={setCity} />
        </div>

        {/* 🌡️ WEATHER CARD */}
        {weather && (
          <div className="mt-8">
            <WeatherCard weather={weather} location={location} />
          </div>
        )}

        {/* 📅 FORECAST – MIDDLE MAIN SECTION */}
        {forecast.length > 0 && (
          <div className="flex-1 w-full flex items-center justify-center">
            <div className="flex gap-6 overflow-x-auto px-4 py-6">
              {forecast.map((day, i) => (
                <ForecastCard key={i} day={day} />
              ))}
            </div>
          </div>
        )}

        {/* 🌅 SUNRISE / SUNSET – BOTTOM */}
        {weather && (
          <div className="mb-6">
            <SunTimeline sunData={weather} />
          </div>
        )}

      </div>
    </div>
  );
}
