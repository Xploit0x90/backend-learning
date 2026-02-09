import { Request, Response } from "express";
import { EventController } from "../src/controller/event.controller";
import type { EventRepository } from "../src/database/repository/event.repository";

/**
 * Unit test for the EventController class.
 */
describe("EventController", () => {
  let eventController: EventController;
  let mockEventRepository: jest.Mocked<EventRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create mock repository
    mockEventRepository = {
      getAllEvents: jest.fn(),
      getEventById: jest.fn(),
      createEvent: jest.fn(),
      updateEvent: jest.fn(),
      deleteEvent: jest.fn(),
      addParticipantToEvent: jest.fn(),
      removeParticipantFromEvent: jest.fn(),
      addTagToEvent: jest.fn(),
      removeTagFromEvent: jest.fn(),
    } as unknown as jest.Mocked<EventRepository>;

    // Create controller instance with mock repository
    eventController = new EventController(mockEventRepository);

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

  describe("getAllEvents", () => {
    it("should return all events successfully", async () => {
      // Arrange
      const mockEvents = [
        {
          id: 1,
          title: "Test Event 1",
          description: "Description 1",
          date: "2024-12-31",
          time: "10:00",
          location: "Berlin",
          max_participants: 50,
          image_url: "https://example.com/image.jpg",
          created_at: new Date().toISOString(),
          participant_count: 10,
        },
        {
          id: 2,
          title: "Test Event 2",
          description: "Description 2",
          date: "2025-01-15",
          time: "14:00",
          location: "Munich",
          max_participants: 30,
          image_url: null,
          created_at: new Date().toISOString(),
          participant_count: 5,
        },
      ];

      mockEventRepository.getAllEvents.mockResolvedValue(mockEvents);

      // Act
      await eventController.getAllEvents(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.getAllEvents).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockEvents,
      });
    });
  });

  describe("getEventById", () => {
    it("should return an event by id", async () => {
      // Arrange
      const mockEvent = {
        id: 1,
        title: "Test Event",
        description: "Test Description",
        date: "2024-12-31",
        time: "10:00",
        location: "Berlin",
        max_participants: 50,
        image_url: "https://example.com/image.jpg",
        created_at: new Date().toISOString(),
        participants: [],
        tags: [],
      };

      mockRequest.params = { id: "1" };
      mockEventRepository.getEventById.mockResolvedValue(mockEvent);

      // Act
      await eventController.getEventById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.getEventById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockEvent,
      });
    });

    it("should return 404 when event not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockEventRepository.getEventById.mockResolvedValue(null);

      // Act
      await eventController.getEventById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.getEventById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Event nicht gefunden",
      });
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };

      // Act
      await eventController.getEventById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Event-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });
  });

  describe("createEvent", () => {
    it("should create an event successfully", async () => {
      // Arrange
      const newEventData = {
        title: "New Event",
        description: "Event Description",
        date: "2024-12-31",
        time: "10:00",
        location: "Berlin",
        max_participants: 50,
        image_url: "https://example.com/image.jpg",
      };
      const createdEvent = {
        id: 1,
        ...newEventData,
        created_at: new Date().toISOString(),
      };

      mockRequest.body = newEventData;
      mockEventRepository.createEvent.mockResolvedValue(createdEvent);

      // Act
      await eventController.createEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      // The validation schema transforms snake_case to camelCase and date string to Date object
      expect(mockEventRepository.createEvent).toHaveBeenCalledWith({
        title: "New Event",
        description: "Event Description",
        location: "Berlin",
        date: expect.any(Date),
        imageUrl: "https://example.com/image.jpg",
        maxParticipants: 50,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Event erfolgreich erstellt",
        data: createdEvent,
      });
    });

    it("should return 400 when validation fails", async () => {
      // Arrange
      const invalidData = {
        title: "", // Invalid: empty title
        date: "invalid-date", // Invalid: not a valid date
        max_participants: -5, // Invalid: negative number
      };

      mockRequest.body = invalidData;

      // Act
      await eventController.createEvent(
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

  describe("updateEvent", () => {
    it("should update an event successfully", async () => {
      // Arrange
      const updateData = {
        title: "Updated Event",
        location: "Munich",
      };
      const updatedEvent = {
        id: 1,
        title: "Updated Event",
        description: "Original Description",
        date: "2024-12-31",
        time: "10:00",
        location: "Munich",
        max_participants: 50,
        image_url: null,
        created_at: new Date().toISOString(),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = updateData;
      mockEventRepository.updateEvent.mockResolvedValue(updatedEvent);

      // Act
      await eventController.updateEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.updateEvent).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Event erfolgreich aktualisiert",
        data: updatedEvent,
      });
    });

    it("should return 404 when event not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockRequest.body = { title: "Updated Event" };
      mockEventRepository.updateEvent.mockResolvedValue(null);

      // Act
      await eventController.updateEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Event nicht gefunden",
      });
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };
      mockRequest.body = { title: "Updated Event" };

      // Act
      await eventController.updateEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Event-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });

    it("should return 400 when request body is empty", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = {};

      // Act
      await eventController.updateEvent(
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

  describe("deleteEvent", () => {
    it("should delete an event successfully", async () => {
      // Arrange
      const existingEvent = {
        id: 1,
        title: "Event to delete",
        description: "Description",
        date: "2024-12-31",
        time: "10:00",
        location: "Berlin",
        max_participants: 50,
        image_url: null,
        created_at: new Date().toISOString(),
      };

      mockRequest.params = { id: "1" };
      mockEventRepository.getEventById.mockResolvedValue(existingEvent);
      mockEventRepository.deleteEvent.mockResolvedValue(undefined);

      // Act
      await eventController.deleteEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.getEventById).toHaveBeenCalledWith(1);
      expect(mockEventRepository.deleteEvent).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Event erfolgreich gelöscht",
      });
    });

    it("should return 404 when event not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockEventRepository.getEventById.mockResolvedValue(null);

      // Act
      await eventController.deleteEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.getEventById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Event nicht gefunden",
      });
      expect(mockEventRepository.deleteEvent).not.toHaveBeenCalled();
    });

    it("should return 400 when id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };

      // Act
      await eventController.deleteEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Ungültige Event-ID. Die ID muss eine positive ganze Zahl sein",
      });
    });
  });

  describe("addParticipantToEvent", () => {
    it("should add a participant to an event successfully", async () => {
      // Arrange
      // Note: addParticipantToEvent reads from req.body, not req.params
      mockRequest.body = { eventId: "1", participantId: "2" };
      mockEventRepository.addParticipantToEvent.mockResolvedValue(undefined);

      // Act
      await eventController.addParticipantToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.addParticipantToEvent).toHaveBeenCalledWith(1, 2);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Teilnehmer erfolgreich zum Event hinzugefügt",
      });
    });

    it("should return 400 when eventId or participantId is missing", async () => {
      // Arrange
      mockRequest.body = { eventId: "1" }; // participantId missing

      // Act
      await eventController.addParticipantToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und participantId sind erforderlich",
      });
    });

    it("should return 400 when event id is invalid", async () => {
      // Arrange
      mockRequest.body = { eventId: "invalid", participantId: "2" };

      // Act
      await eventController.addParticipantToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und participantId müssen positive ganze Zahlen sein",
      });
    });

    it("should return 400 when participant id is invalid", async () => {
      // Arrange
      mockRequest.body = { eventId: "1", participantId: "invalid" };

      // Act
      await eventController.addParticipantToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und participantId müssen positive ganze Zahlen sein",
      });
    });
  });

  describe("removeParticipantFromEvent", () => {
    it("should remove a participant from an event successfully", async () => {
      // Arrange
      // Note: removeParticipantFromEvent reads from req.params
      mockRequest.params = { eventId: "1", participantId: "2" };
      mockEventRepository.removeParticipantFromEvent.mockResolvedValue(undefined);

      // Act
      await eventController.removeParticipantFromEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.removeParticipantFromEvent).toHaveBeenCalledWith(1, 2);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Teilnehmer erfolgreich vom Event entfernt",
      });
    });

    it("should return 400 when event id is invalid", async () => {
      // Arrange
      mockRequest.params = { eventId: "invalid", participantId: "2" };

      // Act
      await eventController.removeParticipantFromEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und participantId müssen positive ganze Zahlen sein",
      });
    });

    it("should return 400 when participant id is invalid", async () => {
      // Arrange
      mockRequest.params = { eventId: "1", participantId: "invalid" };

      // Act
      await eventController.removeParticipantFromEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und participantId müssen positive ganze Zahlen sein",
      });
    });
  });

  describe("addTagToEvent", () => {
    it("should add a tag to an event successfully", async () => {
      // Arrange
      // Note: addTagToEvent reads from req.body, not req.params
      mockRequest.body = { eventId: "1", tagId: "2" };
      mockEventRepository.addTagToEvent.mockResolvedValue(undefined);

      // Act
      await eventController.addTagToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.addTagToEvent).toHaveBeenCalledWith(1, 2);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Tag erfolgreich zum Event hinzugefügt",
      });
    });

    it("should return 400 when eventId or tagId is missing", async () => {
      // Arrange
      mockRequest.body = { eventId: "1" }; // tagId missing

      // Act
      await eventController.addTagToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und tagId sind erforderlich",
      });
    });

    it("should return 400 when event id is invalid", async () => {
      // Arrange
      mockRequest.body = { eventId: "invalid", tagId: "2" };

      // Act
      await eventController.addTagToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und tagId müssen positive ganze Zahlen sein",
      });
    });

    it("should return 400 when tag id is invalid", async () => {
      // Arrange
      mockRequest.body = { eventId: "1", tagId: "invalid" };

      // Act
      await eventController.addTagToEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und tagId müssen positive ganze Zahlen sein",
      });
    });
  });

  describe("removeTagFromEvent", () => {
    it("should remove a tag from an event successfully", async () => {
      // Arrange
      // Note: removeTagFromEvent reads from req.params
      mockRequest.params = { eventId: "1", tagId: "2" };
      mockEventRepository.removeTagFromEvent.mockResolvedValue(undefined);

      // Act
      await eventController.removeTagFromEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockEventRepository.removeTagFromEvent).toHaveBeenCalledWith(1, 2);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Tag erfolgreich vom Event entfernt",
      });
    });

    it("should return 400 when event id is invalid", async () => {
      // Arrange
      mockRequest.params = { eventId: "invalid", tagId: "2" };

      // Act
      await eventController.removeTagFromEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und tagId müssen positive ganze Zahlen sein",
      });
    });

    it("should return 400 when tag id is invalid", async () => {
      // Arrange
      mockRequest.params = { eventId: "1", tagId: "invalid" };

      // Act
      await eventController.removeTagFromEvent(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "eventId und tagId müssen positive ganze Zahlen sein",
      });
    });
  });
});


