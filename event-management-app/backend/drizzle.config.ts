import "dotenv/config";
import { defineConfig } from "drizzle-kit";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST ?? "localhost";
  const port = process.env.DB_PORT ?? "5432";
  const user = process.env.DB_USER ?? "eventuser";
  const password = process.env.DB_PASSWORD ?? "eventpass123";
  const dbName = process.env.DB_NAME ?? "eventmanagement";
  return `postgresql://${user}:${password}@${host}:${port}/${dbName}`;
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: getDatabaseUrl() },
});
