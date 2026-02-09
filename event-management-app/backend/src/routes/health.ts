import express from "express";
import type { Request, Response } from "express";
import HealthController from "../controller/healthController.js";

const router = express.Router();
const healthController = new HealthController();

router.get("/health", (req: Request, res: Response) => {
  healthController.getHealthStatus(req, res);
});
router.get("/db-test", (req: Request, res: Response) => {
  healthController.getDbTest(req, res);
});

export default router;
