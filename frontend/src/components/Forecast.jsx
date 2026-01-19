export default function ForecastCard({ day }) {
  if (!day || !day.main) return null; // 🛡 safety

  const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const temp = Math.round(day.main.temp);
  const humidity = day.main.humidity;
  const condition = day.weather?.[0]?.main;

  return (
    <div className="bg-white/70 p-4 m-2 min-w-[140px] text-center rounded-lg shadow-md flex flex-col items-center">
      <p className="font-semibold">{date}</p>

      <p className="text-2xl font-bold mt-2">{temp}°C</p>

      <p className="text-sm mt-1">{condition}</p>

      <p className="mt-1">Humidity: {humidity}%</p>
    </div>
  );
}
