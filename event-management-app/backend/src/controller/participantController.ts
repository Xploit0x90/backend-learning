import type { Request, Response } from "express";
import ParticipantService from "../services/participantService.js";
import {
  createParticipantZodSchema,
  updateParticipantZodSchema,
} from "../validators/participantValidation.js";
import { validateId, validateRequestBody } from "../utils/validation.js";
import { ZodError } from "zod";

class ParticipantController {
  private participantService: ParticipantService;

  constructor() {
    this.participantService = new ParticipantService();
  }

  async getAllParticipants(_req: Request, res: Response) {
    try {
      const participants = await this.participantService.getAllParticipants();
      return res.json({ success: true, data: participants });
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({
        success: false,
        message: "Error loading participants",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getParticipantById(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid participant ID. Must be a positive integer.",
        });
      const participantItem = await this.participantService.getParticipantById(id);
      if (!participantItem)
        return res.status(404).json({ success: false, message: "Participant not found" });
      return res.json({ success: true, data: participantItem });
    } catch (error) {
      console.error("Error fetching participant:", error);
      return res.status(500).json({
        success: false,
        message: "Error loading participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createParticipant(req: Request, res: Response) {
    try {
      const validatedData = createParticipantZodSchema.parse(req.body);
      const newParticipant = await this.participantService.createParticipant(validatedData);
      if (!newParticipant)
        return res.status(500).json({ success: false, message: "Failed to create participant" });
      return res.status(201).json({
        success: true,
        message: "Participant created successfully",
        data: newParticipant,
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
        return res.status(409).json({
          success: false,
          message: "A participant with this email already exists",
        });
      console.error("Error creating participant:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateParticipant(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid participant ID. Must be a positive integer.",
        });
      if (!validateRequestBody(req.body))
        return res.status(400).json({
          success: false,
          message: "Request body must not be empty. At least one field required.",
        });
      const validatedData = updateParticipantZodSchema.parse(req.body);
      const updated = await this.participantService.updateParticipant(id, validatedData);
      if (!updated)
        return res.status(404).json({ success: false, message: "Participant not found" });
      return res.json({
        success: true,
        message: "Participant updated successfully",
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
      const err = error as { code?: string };
      if (err.code === "23505")
        return res.status(409).json({
          success: false,
          message: "A participant with this email already exists",
        });
      console.error("Error updating participant:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteParticipant(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid participant ID. Must be a positive integer.",
        });
      const participantItem = await this.participantService.getParticipantById(id);
      if (!participantItem)
        return res.status(404).json({ success: false, message: "Participant not found" });
      await this.participantService.deleteParticipant(id);
      return res.json({ success: true, message: "Participant deleted successfully" });
    } catch (error) {
      console.error("Error deleting participant:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default ParticipantController;
