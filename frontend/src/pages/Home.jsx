import { useState, useEffect } from "react";
import { getWeatherByCity, getWeatherByLocation, getRecentCities } from "../services/weatherApi";
import SearchBar from "../components/SearchCity";
import WeatherCard from "../components/WeatherCard";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [recentCities, setRecentCities] = useState([]);

  // Fetch recent cities from backend
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await getRecentCities();
        setRecentCities(res.data);
      } catch (error) {
        console.error("Failed to fetch recent cities:", error.response?.data || error.message);
      }
    };
    fetchRecent();
  }, []);

  // Fetch by city (calls /api/weather/:city)
  const fetchWeather = async (city) => {
    try {
      const res = await getWeatherByCity(city);
      setWeather(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("City not found or API error");
    }
  };

  // Fetch by geolocation (calls /api/weather?lat=&lon=)
  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await getWeatherByLocation(latitude, longitude);
        setWeather(res.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Failed to fetch weather for your location");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">🌤️ Weather Forecast</h1>

      {/* Search and location buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full max-w-md">
        <SearchBar onSearch={fetchWeather} />
        <button
          onClick={fetchWeatherByLocation}
          className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Use My Location
        </button>
      </div>

      {/* Weather info */}
      {weather && <WeatherCard data={weather} />}

      {/* Recent searches */}
      {recentCities.length > 0 && (
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 max-w-md w-full">
          <h3 className="text-xl font-semibold mb-2 text-center">Recent Cities</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {recentCities.map((city) => (
              <button
                key={city._id}
                onClick={() => fetchWeather(city.name)}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white shadow transition"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
