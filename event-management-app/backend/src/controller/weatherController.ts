import type { Request, Response } from "express";
import axios from "axios";

function extractCityName(location: string): string {
  let cleaned = location.trim();
  const countries = [
    "germany", "deutschland", "mexico", "usa", "united states",
    "france", "spain", "italy", "uk", "united kingdom", "austria",
    "switzerland", "netherlands", "belgium", "poland", "czech republic",
  ];
  const cityIndicators = [
    "stadt", "city", "town", "münchen", "munich", "berlin", "hamburg",
    "frankfurt", "köln", "cologne", "stuttgart", "düsseldorf", "dresden",
    "mexico city", "mexico", "london", "paris", "madrid", "rome",
  ];
  if (cleaned.includes(",")) {
    const parts = cleaned.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1].toLowerCase();
      const isCountry = countries.some((c) => lastPart.includes(c));
      if (isCountry) {
        for (let i = parts.length - 2; i >= 0; i--) {
          const part = parts[i].toLowerCase();
          if (cityIndicators.some((ind) => part.includes(ind))) return parts[i];
        }
        if (lastPart.includes("mexico")) return "Mexico City";
        if (lastPart.includes("germany") || lastPart.includes("deutschland")) return "Berlin";
        if (parts.length >= 2) return parts[parts.length - 2];
      } else {
        return parts[parts.length - 1];
      }
    }
  }
  const lower = cleaned.toLowerCase();
  for (const ind of cityIndicators) {
    if (lower.includes(ind)) {
      const words = cleaned.split(/\s+/);
      for (const word of words) {
        if (word.toLowerCase().includes(ind)) return word;
      }
    }
  }
  for (const country of countries) {
    if (lower.includes(country)) {
      if (country.includes("mexico")) return "Mexico City";
      if (country.includes("germany") || country.includes("deutschland")) return "Berlin";
    }
  }
  return cleaned;
}

class WeatherController {
  async getWeather(req: Request, res: Response) {
    try {
      const { location, date } = req.query;
      if (!location) {
        return res.status(400).json({
          success: false,
          message: "Location parameter is required",
        });
      }
      const apiKey = process.env.WEATHER_API_KEY;
      const isApiKeyConfigured =
        apiKey && typeof apiKey === "string" && apiKey.trim().length > 0;
      if (!isApiKeyConfigured) {
        return res.status(500).json({
          success: false,
          message: "Weather API key not configured. Add WEATHER_API_KEY to .env",
        });
      }
      const cityName = extractCityName(location as string);
      let weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(cityName)}&lang=de`;
      let response: { data: Record<string, unknown> };
      try {
        response = await axios.get(weatherUrl);
      } catch (firstError: unknown) {
        const err = firstError as { response?: { status: number } };
        if (err.response?.status === 400 || err.response?.status === 404) {
          try {
            weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location as string)}&lang=de`;
            response = await axios.get(weatherUrl);
          } catch {
            throw firstError;
          }
        } else {
          throw firstError;
        }
      }
      const data = response.data as {
        location: { name: string; country: string };
        current: {
          temp_c: number;
          feelslike_c: number;
          condition: { text: string; icon: string };
          humidity: number;
          wind_kph: number;
        };
      };
      const weatherData = {
        location: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        description: data.current.condition.text,
        icon: `https:${data.current.condition.icon}`,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        condition: data.current.condition.text,
      };
      return res.json({ success: true, data: weatherData });
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      if (err.response?.status === 401 || err.response?.status === 403) {
        return res.status(401).json({
          success: false,
          message: "Invalid API key. Check WEATHER_API_KEY in .env",
        });
      }
      if (err.response?.status === 400) {
        return res.status(404).json({
          success: false,
          message: "Location not found",
        });
      }
      console.error("Error fetching weather:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching weather data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default WeatherController;
