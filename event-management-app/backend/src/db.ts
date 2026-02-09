import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function getConnectionString(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST ?? "localhost";
  const port = process.env.DB_PORT ?? "5432";
  const user = process.env.DB_USER ?? "eventuser";
  const password = process.env.DB_PASSWORD ?? "eventpass123";
  const dbName = process.env.DB_NAME ?? "eventmanagement";
  return `postgresql://${user}:${password}@${host}:${port}/${dbName}`;
}

const pool = new Pool({ connectionString: getConnectionString() });
export const db = drizzle(pool);
export { pool };
