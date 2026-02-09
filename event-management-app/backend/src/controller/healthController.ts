import type { Request, Response } from "express";
import { pool } from "../db.js";

class HealthController {
  async getHealthStatus(req: Request, res: Response) {
    return res.json({
      status: "OK",
      message: "Server is running!",
      timestamp: new Date().toISOString(),
    });
  }

  async getDbTest(req: Request, res: Response) {
    try {
      const result = await pool.query("SELECT NOW()");
      return res.json({
        status: "OK",
        message: "Database connected!",
        timestamp: result.rows[0].now,
      });
    } catch (error) {
      return res.status(500).json({
        status: "ERROR",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default HealthController;
