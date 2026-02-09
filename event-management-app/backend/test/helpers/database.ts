import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import { Database } from "../../src/database";
import { databaseSchema } from "../../src/database/schema";

export class TestDatabase {
  private container!: StartedPostgreSqlContainer;
  public database!: Database;
  private pool!: Pool;

  async setup() {
    this.container = await new PostgreSqlContainer("postgres:15").start();
    this.pool = new Pool({
      connectionString: this.container.getConnectionUri(),
    });
    this.database = drizzle({
      client: this.pool,
      schema: databaseSchema,
      casing: "snake_case",
    });
    await migrate(this.database, { migrationsFolder: "./drizzle" });
  }

  async teardown() {
    await this.pool.end();
    await this.container.stop();
  }
}
