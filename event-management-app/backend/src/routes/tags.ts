import express from "express";
import type { Request, Response } from "express";
import EventController from "../controller/eventController.js";
import TagController from "../controller/tagController.js";

const router = express.Router();
const tagController = new TagController();
const eventController = new EventController();

router.get("/", (req: Request, res: Response) => {
  tagController.getAllTags(req, res);
});
router.get("/:id", (req: Request, res: Response) => {
  tagController.getTagById(req, res);
});
router.post("/", (req: Request, res: Response) => {
  tagController.createTag(req, res);
});
router.put("/:id", (req: Request, res: Response) => {
  tagController.updateTag(req, res);
});
router.delete("/:id", (req: Request, res: Response) => {
  tagController.deleteTag(req, res);
});
router.post("/add-to-event", (req: Request, res: Response) => {
  eventController.addTagToEvent(req, res);
});
router.delete("/:tagId/events/:eventId", (req: Request, res: Response) => {
  eventController.removeTagFromEvent(req, res);
});

export default router;
