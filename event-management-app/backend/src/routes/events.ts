import express from "express";
import type { Request, Response } from "express";
import EventController from "../controller/eventController.js";

const router = express.Router();
const eventController = new EventController();

router.get("/", (req: Request, res: Response) => {
  eventController.getAllEvents(req, res);
});
router.get("/:id", (req: Request, res: Response) => {
  eventController.getEventById(req, res);
});
router.post("/", (req: Request, res: Response) => {
  eventController.createEvent(req, res);
});
router.put("/:id", (req: Request, res: Response) => {
  eventController.updateEvent(req, res);
});
router.delete("/:id", (req: Request, res: Response) => {
  eventController.deleteEvent(req, res);
});

export default router;
