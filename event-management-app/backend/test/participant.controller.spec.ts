import { Request, Response } from "express";
import { ParticipantController } from "../src/controller/participant.controller";
import type { ParticipantRepository } from "../src/database/repository/participant.repository";

/**
 * Unit test for the ParticipantController class.
 */
describe("ParticipantController", () => {
  let participantController: ParticipantController;
  let mockParticipantRepository: jest.Mocked<ParticipantRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create mock repository
    mockParticipantRepository = {
      getAllParticipants: jest.fn(),
      getParticipantById: jest.fn(),
      createParticipant: jest.fn(),
      updateParticipant: jest.fn(),
      deleteParticipant: jest.fn(),
    } as unknown as jest.Mocked<ParticipantRepository>;

    // Create controller instance with mock repository
    participantController = new ParticipantController(mockParticipantRepository);

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

  describe("getAllParticipants", () => {
    it("should return all participants successfully", async () => {
      // Arrange
      const mockParticipants = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "123456789",
          notes: "Test participant",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          phone: "987654321",
          notes: null,
          created_at: new Date().toISOString(),
        },
      ];

      mockParticipantRepository.getAllParticipants.mockResolvedValue(mockParticipants);

      // Act
      await participantController.getAllParticipants(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockParticipantRepository.getAllParticipants).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockParticipants,
      });
    });
  });

  describe("getParticipantById", () => {
    it("should return a participant by id", async () => {
      // Arrange
      const mockParticipant = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        notes: "Test participant",
        created_at: new Date().toISOString(),
        events: [],
      };

      mockRequest.params = { id: "1" };
      mockParticipantRepository.getParticipantById.mockResolvedValue(mockParticipant);

      // Act
      await participantController.getParticipantById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockParticipantRepository.getParticipantById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockParticipant,
      });
    });

    it("should return 404 when participant not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockParticipantRepository.getParticipantById.mockResolvedValue(null);

      // Act
      await participantController.getParticipantById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockParticipantRepository.getParticipantById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Teilnehmer nicht gefunden",
      });
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };

      // Act
      await participantController.getParticipantById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Teilnehmer-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });
  });

  describe("createParticipant", () => {
    it("should create a participant successfully", async () => {
      // Arrange
      const newParticipantData = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        notes: "Test participant",
      };
      const createdParticipant = {
        id: 1,
        ...newParticipantData,
        created_at: new Date().toISOString(),
      };

      mockRequest.body = newParticipantData;
      mockParticipantRepository.createParticipant.mockResolvedValue(createdParticipant);

      // Act
      await participantController.createParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      // The validation schema transforms snake_case to camelCase
      // studyProgram is undefined when not provided (not null)
      expect(mockParticipantRepository.createParticipant).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        studyProgram: undefined,
        notes: "Test participant",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Teilnehmer erfolgreich erstellt",
        data: createdParticipant,
      });
    });

    it("should return 409 when email already exists", async () => {
      // Arrange
      const newParticipantData = {
        first_name: "John",
        last_name: "Doe",
        email: "existing@example.com",
        phone: "123456789",
      };
      const error = new Error("Duplicate email") as Error & { code?: string };
      error.code = "23505";

      mockRequest.body = newParticipantData;
      mockParticipantRepository.createParticipant.mockRejectedValue(error);

      // Act
      await participantController.createParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ein Teilnehmer mit dieser E-Mail existiert bereits",
      });
    });

    it("should return 400 when validation fails", async () => {
      // Arrange
      const invalidData = {
        first_name: "", // Invalid: empty name
        last_name: "", // Invalid: empty name
        email: "invalid-email", // Invalid: not a valid email
      };

      mockRequest.body = invalidData;

      // Act
      await participantController.createParticipant(
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

  describe("updateParticipant", () => {
    it("should update a participant successfully", async () => {
      // Arrange
      const updateData = {
        first_name: "Updated",
        email: "updated@example.com",
      };
      const updatedParticipant = {
        id: 1,
        first_name: "Updated",
        last_name: "Doe",
        email: "updated@example.com",
        phone: "123456789",
        notes: null,
        created_at: new Date().toISOString(),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = updateData;
      mockParticipantRepository.updateParticipant.mockResolvedValue(updatedParticipant);

      // Act
      await participantController.updateParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      // The validation schema transforms snake_case to camelCase
      // The update includes all provided fields
      expect(mockParticipantRepository.updateParticipant).toHaveBeenCalledWith(1, {
        firstName: "Updated",
        email: "updated@example.com",
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Teilnehmer erfolgreich aktualisiert",
        data: updatedParticipant,
      });
    });

    it("should return 404 when participant not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockRequest.body = { first_name: "Updated" };
      mockParticipantRepository.updateParticipant.mockResolvedValue(null);

      // Act
      await participantController.updateParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Teilnehmer nicht gefunden",
      });
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };
      mockRequest.body = { first_name: "Updated" };

      // Act
      await participantController.updateParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Teilnehmer-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });

    it("should return 400 when request body is empty", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = {};

      // Act
      await participantController.updateParticipant(
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

  describe("deleteParticipant", () => {
    it("should delete a participant successfully", async () => {
      // Arrange
      const existingParticipant = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        notes: null,
        created_at: new Date().toISOString(),
      };

      mockRequest.params = { id: "1" };
      mockParticipantRepository.getParticipantById.mockResolvedValue(existingParticipant);
      mockParticipantRepository.deleteParticipant.mockResolvedValue(undefined);

      // Act
      await participantController.deleteParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockParticipantRepository.getParticipantById).toHaveBeenCalledWith(1);
      expect(mockParticipantRepository.deleteParticipant).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Teilnehmer erfolgreich gelöscht",
      });
    });

    it("should return 404 when participant not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockParticipantRepository.getParticipantById.mockResolvedValue(null);

      // Act
      await participantController.deleteParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockParticipantRepository.getParticipantById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Teilnehmer nicht gefunden",
      });
      expect(mockParticipantRepository.deleteParticipant).not.toHaveBeenCalled();
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };

      // Act
      await participantController.deleteParticipant(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Teilnehmer-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });
  });
});


