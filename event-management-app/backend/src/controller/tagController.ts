import type { Request, Response } from "express";
import TagService from "../services/tagService.js";
import {
  createTagZodSchema,
  updateTagZodSchema,
} from "../validators/tagValidation.js";
import { validateId, validateRequestBody } from "../utils/validation.js";
import { ZodError } from "zod";

class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  async getAllTags(_req: Request, res: Response) {
    try {
      const tags = await this.tagService.getAllTags();
      return res.json({ success: true, data: tags });
    } catch (error) {
      console.error("Error fetching tags:", error);
      return res.status(500).json({
        success: false,
        message: "Error loading tags",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getTagById(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid tag ID. Must be a positive integer.",
        });
      const tagItem = await this.tagService.getTagById(id);
      if (!tagItem)
        return res.status(404).json({ success: false, message: "Tag not found" });
      return res.json({ success: true, data: tagItem });
    } catch (error) {
      console.error("Error fetching tag:", error);
      return res.status(500).json({
        success: false,
        message: "Error loading tag",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createTag(req: Request, res: Response) {
    try {
      const validatedData = createTagZodSchema.parse(req.body);
      const newTag = await this.tagService.createTag(validatedData);
      if (!newTag)
        return res.status(500).json({ success: false, message: "Failed to create tag" });
      return res.status(201).json({
        success: true,
        message: "Tag created successfully",
        data: newTag,
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
          message: "A tag with this name already exists",
        });
      console.error("Error creating tag:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating tag",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateTag(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid tag ID. Must be a positive integer.",
        });
      if (!validateRequestBody(req.body))
        return res.status(400).json({
          success: false,
          message: "Request body must not be empty. At least one field required.",
        });
      const validatedData = updateTagZodSchema.parse(req.body);
      const updated = await this.tagService.updateTag(id, validatedData);
      if (!updated)
        return res.status(404).json({ success: false, message: "Tag not found" });
      return res.json({
        success: true,
        message: "Tag updated successfully",
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
          message: "A tag with this name already exists",
        });
      console.error("Error updating tag:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating tag",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteTag(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id);
      if (!id)
        return res.status(400).json({
          success: false,
          message: "Invalid tag ID. Must be a positive integer.",
        });
      const tagItem = await this.tagService.getTagById(id);
      if (!tagItem)
        return res.status(404).json({ success: false, message: "Tag not found" });
      await this.tagService.deleteTag(id);
      return res.json({ success: true, message: "Tag deleted successfully" });
    } catch (error) {
      console.error("Error deleting tag:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting tag",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default TagController;
