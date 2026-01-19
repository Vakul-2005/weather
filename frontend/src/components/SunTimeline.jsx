import { WiSunrise, WiSunset } from "react-icons/wi";

export default function SunTimeline({ sunData }) {
  if (!sunData) return null;

  // Convert UNIX timestamps to HH:MM format
  const sunrise = new Date(sunData.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(sunData.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex gap-12 items-center justify-center">
      {/* Sunrise card */}
      <div className="flex flex-col items-center justify-center bg-white/70 px-4 py-2 rounded-lg shadow-md text-yellow-400">
        <WiSunrise size={40} />
        <span className="mt-1 font-semibold">{sunrise}</span>
        <span className="text-sm">Sunrise</span>
      </div>

      {/* Sunset card */}
      <div className="flex flex-col items-center justify-center bg-white/70 px-4 py-2 rounded-lg shadow-md text-orange-500">
        <WiSunset size={40} />
        <span className="mt-1 font-semibold">{sunset}</span>
        <span className="text-sm">Sunset</span>
      </div>
    </div>
  );
}
