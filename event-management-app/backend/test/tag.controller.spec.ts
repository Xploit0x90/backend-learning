import { Request, Response } from "express";
import { TagController } from "../src/controller/tag.controller";
import type { TagRepository } from "../src/database/repository/tag.repository";

/**
 * Unit test for the TagController class.
 *
 * Typically, controllers are tested with integration tests rather than unit tests,
 * as integration tests are generally easier to write, understand, and better simulate real-world scenarios.
 * However, this example demonstrates how to mock dependencies to isolate and test controller logic
 * that interacts with external services.
 */
describe("TagController", () => {
  let tagController: TagController;
  let mockTagRepository: jest.Mocked<TagRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create mock repository
    mockTagRepository = {
      getAllTags: jest.fn(),
      getTagById: jest.fn(),
      createTag: jest.fn(),
      updateTag: jest.fn(),
      deleteTag: jest.fn(),
    } as unknown as jest.Mocked<TagRepository>;

    // Create controller instance with mock repository
    tagController = new TagController(mockTagRepository);

    // Setup mock request and response
    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllTags", () => {
    it("should return all tags successfully", async () => {
      // Arrange
      const mockTags = [
        {
          id: 1,
          name: "tag1",
          color: "#FF5733",
          created_at: new Date().toISOString(),
          event_count: 0,
        },
        {
          id: 2,
          name: "tag2",
          color: "#33FF57",
          created_at: new Date().toISOString(),
          event_count: 0,
        },
      ];

      // Mock the repository method to return the mock tags
      mockTagRepository.getAllTags.mockResolvedValue(mockTags);

      // Act
      await tagController.getAllTags(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.getAllTags).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTags,
      });
    });
  });

  describe("getTagById", () => {
    it("should return a tag by id", async () => {
      // Arrange
      const mockTag = {
        id: 1,
        name: "tag1",
        color: "#FF5733",
        created_at: new Date().toISOString(),
        events: [],
      };

      mockRequest.params = { id: "1" };
      mockTagRepository.getTagById.mockResolvedValue(mockTag);

      // Act
      await tagController.getTagById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.getTagById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTag,
      });
    });

    it("should return 404 when tag not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockTagRepository.getTagById.mockResolvedValue(null);

      // Act
      await tagController.getTagById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.getTagById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Tag nicht gefunden",
      });
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };

      // Act
      await tagController.getTagById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Tag-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });
  });

  describe("createTag", () => {
    it("should create a tag successfully", async () => {
      // Arrange
      const newTagData = {
        name: "New Tag",
        color: "#FF5733",
      };
      const createdTag = {
        id: 1,
        ...newTagData,
        created_at: new Date().toISOString(),
      };

      mockRequest.body = newTagData;
      mockTagRepository.createTag.mockResolvedValue(createdTag);

      // Act
      await tagController.createTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.createTag).toHaveBeenCalledWith(newTagData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Tag erfolgreich erstellt",
        data: createdTag,
      });
    });

    it("should return 409 when tag name already exists", async () => {
      // Arrange
      const newTagData = {
        name: "Existing Tag",
        color: "#FF5733",
      };
      const error = new Error("Duplicate tag");
      (error as any).code = "23505";

      mockRequest.body = newTagData;
      mockTagRepository.createTag.mockRejectedValue(error);

      // Act
      await tagController.createTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ein Tag mit diesem Namen existiert bereits",
      });
    });

    it("should return 400 when validation fails", async () => {
      // Arrange
      const invalidData = {
        name: "", // Invalid: empty name
        color: "invalid", // Invalid: not a hex color
      };

      mockRequest.body = invalidData;

      // Act
      await tagController.createTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Validierungsfehler",
          errors: expect.any(Array),
        }),
      );
    });
  });

  describe("updateTag", () => {
    it("should update a tag successfully", async () => {
      // Arrange
      const updateData = {
        name: "Updated Tag",
        color: "#33FF57",
      };
      const updatedTag = {
        id: 1,
        ...updateData,
        created_at: new Date().toISOString(),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = updateData;
      mockTagRepository.updateTag.mockResolvedValue(updatedTag);

      // Act
      await tagController.updateTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.updateTag).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Tag erfolgreich aktualisiert",
        data: updatedTag,
      });
    });

    it("should return 404 when tag not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockRequest.body = { name: "Updated Tag" };
      mockTagRepository.updateTag.mockResolvedValue(null);

      // Act
      await tagController.updateTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Tag nicht gefunden",
      });
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };
      mockRequest.body = { name: "Updated Tag" };

      // Act
      await tagController.updateTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Tag-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });

    it("should return 400 when request body is empty", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = {};

      // Act
      await tagController.updateTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Der Request-Body darf nicht leer sein. Mindestens ein Feld muss aktualisiert werden",
      });
    });
  });

  describe("deleteTag", () => {
    it("should delete a tag successfully", async () => {
      // Arrange
      const existingTag = {
        id: 1,
        name: "Tag to delete",
        color: "#FF5733",
        created_at: new Date().toISOString(),
      };

      mockRequest.params = { id: "1" };
      mockTagRepository.getTagById.mockResolvedValue(existingTag);
      mockTagRepository.deleteTag.mockResolvedValue(undefined);

      // Act
      await tagController.deleteTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.getTagById).toHaveBeenCalledWith(1);
      expect(mockTagRepository.deleteTag).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Tag erfolgreich gelöscht",
      });
    });

    it("should return 404 when tag not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockTagRepository.getTagById.mockResolvedValue(null);

      // Act
      await tagController.deleteTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockTagRepository.getTagById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Tag nicht gefunden",
      });
      expect(mockTagRepository.deleteTag).not.toHaveBeenCalled();
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };

      // Act
      await tagController.deleteTag(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Tag-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });
  });
});
