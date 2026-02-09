import express from "express";
import type { Request, Response } from "express";
import EventController from "../controller/eventController.js";
import ParticipantController from "../controller/participantController.js";

const router = express.Router();
const participantController = new ParticipantController();
const eventController = new EventController();

router.get("/", (req: Request, res: Response) => {
  participantController.getAllParticipants(req, res);
});
router.get("/:id", (req: Request, res: Response) => {
  participantController.getParticipantById(req, res);
});
router.post("/", (req: Request, res: Response) => {
  participantController.createParticipant(req, res);
});
router.put("/:id", (req: Request, res: Response) => {
  participantController.updateParticipant(req, res);
});
router.delete("/:id", (req: Request, res: Response) => {
  participantController.deleteParticipant(req, res);
});
router.post("/add-to-event", (req: Request, res: Response) => {
  eventController.addParticipantToEvent(req, res);
});
router.delete("/:participantId/events/:eventId", (req: Request, res: Response) => {
  eventController.removeParticipantFromEvent(req, res);
});

export default router;
