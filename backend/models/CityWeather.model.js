import mongoose from "mongoose";

const CityWeatherSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true },
    country: String,
    lat: Number,
    lon: Number,
    current: Object,
    forecast: Array,
    airQuality: Object,
  },
  { timestamps: true }
);

export default mongoose.model("CityWeather", CityWeatherSchema);
