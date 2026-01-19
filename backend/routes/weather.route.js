import express from "express";
import { getWeatherForecast } from "../controllers/weather.controller.js";

const router = express.Router();

router.get("/", getWeatherForecast);
router.get("/:city", getWeatherForecast);

export default router;
