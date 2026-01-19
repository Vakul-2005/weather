export default function WeatherCard({ weather, location }) {
  if (!weather) return null;

  return (
    <div className="bg-white/70 p-6 rounded-xl shadow-md text-center">
      {location && (
        <p className="text-sm uppercase tracking-wide text-gray-600">
          {location.city}, {location.country}
        </p>
      )}

      <h2 className="text-2xl font-bold mt-1">
        {weather.weather?.main}
      </h2>

      <p className="text-4xl font-bold mt-2">
        {Math.round(weather.temp)}°C
      </p>

      <p className="mt-1 text-gray-700">
        Humidity: {weather.humidity}%
      </p>
    </div>
  );
}
