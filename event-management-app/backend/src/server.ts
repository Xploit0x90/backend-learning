import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { count } from "drizzle-orm";
import eventRouter from "./routes/events.js";
import participantRouter from "./routes/participants.js";
import tagRouter from "./routes/tags.js";
import healthRouter from "./routes/health.js";
import weatherRouter from "./routes/weather.js";
import { logger } from "./middleware/logger.js";
import { db } from "./db.js";
import { event, participant, tag } from "./db/schema.js";

dotenv.config();

const PORT = Number(process.env.PORT ?? 8080);

async function checkAndSeed() {
  try {
    const [tc] = await db.select({ count: count() }).from(tag);
    const [pc] = await db.select({ count: count() }).from(participant);
    const [ec] = await db.select({ count: count() }).from(event);
    const hasData = Number(tc?.count ?? 0) > 0 || Number(pc?.count ?? 0) > 0 || Number(ec?.count ?? 0) > 0;
    if (hasData) return;
    const { seed } = await import("./scripts/seed.js");
    await seed(false);
    console.log("Database seeded with sample data.");
  } catch (e) {
    console.error("Seed check failed:", e);
  }
}

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : true;
const server = express();
server.use(cors({ origin: corsOrigin, credentials: true }));
server.use(express.json());
server.use(logger);

server.use("/api/events", eventRouter);
server.use("/api/participants", participantRouter);
server.use("/api/tags", tagRouter);
server.use("/api", healthRouter);
server.use("/api/weather", weatherRouter);

checkAndSeed().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`Events: http://0.0.0.0:${PORT}/api/events`);
    console.log(`Participants: http://0.0.0.0:${PORT}/api/participants`);
    console.log(`Tags: http://0.0.0.0:${PORT}/api/tags`);
  });
});
