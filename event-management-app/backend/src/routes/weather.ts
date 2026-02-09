import express from "express";
import type { Request, Response } from "express";
import WeatherController from "../controller/weatherController.js";

const router = express.Router();
const weatherController = new WeatherController();

router.get("/", (req: Request, res: Response) => {
  weatherController.getWeather(req, res);
});

export default router;
