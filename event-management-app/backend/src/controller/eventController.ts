import type { Request, Response } from "express";
import EventService from "../services/eventService.js";
import {
  createEventZodSchema,
  updateEventZodSchema,
} from "../validators/eventValidation.js";
import { validateId, validateRequestBody } from "../utils/validation.js";
import { ZodError } from "zod";

class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  async getAllEvents(_req: Request, res: Response) {
    try {
      const events = await this.eventService.getAllEvents();
      return res.json({ success: true, data: events });
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({
        success: false,
        message: "Error loading events",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid event ID. Must be a positive integer.",
        });
      const eventItem = await this.eventService.getEventById(id);
      if (!eventItem)
        return res.status(404).json({ success: false, message: "Event not found" });
      return res.json({ success: true, data: eventItem });
    } catch (error) {
      console.error("Error fetching event:", error);
      return res.status(500).json({
        success: false,
        message: "Error loading event",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const validatedData = createEventZodSchema.parse(req.body);
      const newEvent = await this.eventService.createEvent(validatedData);
      if (!newEvent)
        return res.status(500).json({ success: false, message: "Failed to create event" });
      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
      }
      const err = error as { code?: string };
      if (err.code === "23505")
        return res.status(409).json({ success: false, message: "Event with this data already exists" });
      if (err.code === "23502")
        return res.status(400).json({ success: false, message: "Required field missing" });
      console.error("Error creating event:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating event",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid event ID. Must be a positive integer.",
        });
      if (!validateRequestBody(req.body))
        return res.status(400).json({
          success: false,
          message: "Request body must not be empty. At least one field required.",
        });
      const validatedData = updateEventZodSchema.parse(req.body);
      const updated = await this.eventService.updateEvent(id, validatedData);
      if (!updated)
        return res.status(404).json({ success: false, message: "Event not found" });
      return res.json({
        success: true,
        message: "Event updated successfully",
        data: updated,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
      }
      console.error("Error updating event:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating event",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid event ID. Must be a positive integer.",
        });
      const eventItem = await this.eventService.getEventById(id);
      if (!eventItem)
        return res.status(404).json({ success: false, message: "Event not found" });
      await this.eventService.deleteEvent(id);
      return res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting event",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async addParticipantToEvent(req: Request, res: Response) {
    try {
      const { eventId, participantId } = req.body;
      if (!eventId || !participantId)
        return res.status(400).json({
          success: false,
          message: "eventId and participantId are required",
        });
      const eid = validateId(String(eventId));
      const pid = validateId(String(participantId));
      if (!eid || !pid)
        return res.status(400).json({
          success: false,
          message: "eventId and participantId must be positive integers",
        });
      await this.eventService.addParticipantToEvent(eid, pid);
      return res.status(201).json({
        success: true,
        message: "Participant added to event successfully",
      });
    } catch (error) {
      const err = error as { code?: string };
      if (err.code === "23505")
        return res.status(409).json({
          success: false,
          message: "Participant is already registered for this event",
        });
      console.error("Error adding participant to event:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async removeParticipantFromEvent(req: Request, res: Response) {
    try {
      const eventId = validateId(req.params.eventId);
      const participantId = validateId(req.params.participantId);
      if (!eventId || !participantId)
        return res.status(400).json({
          success: false,
          message: "eventId and participantId must be positive integers",
        });
      await this.eventService.removeParticipantFromEvent(eventId, participantId);
      return res.json({
        success: true,
        message: "Participant removed from event successfully",
      });
    } catch (error) {
      console.error("Error removing participant from event:", error);
      return res.status(500).json({
        success: false,
        message: "Error removing participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async addTagToEvent(req: Request, res: Response) {
    try {
      const { eventId, tagId } = req.body;
      if (!eventId || !tagId)
        return res.status(400).json({
          success: false,
          message: "eventId and tagId are required",
        });
      const eid = validateId(String(eventId));
      const tid = validateId(String(tagId));
      if (!eid || !tid)
        return res.status(400).json({
          success: false,
          message: "eventId and tagId must be positive integers",
        });
      await this.eventService.addTagToEvent(eid, tid);
      return res.status(201).json({
        success: true,
        message: "Tag added to event successfully",
      });
    } catch (error) {
      const err = error as { code?: string };
      if (err.code === "23505")
        return res.status(409).json({
          success: false,
          message: "Tag is already assigned to this event",
        });
      console.error("Error adding tag to event:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding tag",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async removeTagFromEvent(req: Request, res: Response) {
    try {
      const eventId = validateId(req.params.eventId);
      const tagId = validateId(req.params.tagId);
      if (!eventId || !tagId)
        return res.status(400).json({
          success: false,
          message: "eventId and tagId must be positive integers",
        });
      await this.eventService.removeTagFromEvent(eventId, tagId);
      return res.json({
        success: true,
        message: "Tag removed from event successfully",
      });
    } catch (error) {
      console.error("Error removing tag from event:", error);
      return res.status(500).json({
        success: false,
        message: "Error removing tag",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default EventController;
