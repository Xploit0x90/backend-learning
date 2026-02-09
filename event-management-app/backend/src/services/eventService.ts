import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db.js";
import { event, eventParticipant, eventTag, tag, participant } from "../db/schema.js";
import type { CreateEvent, UpdateEvent } from "../validators/eventValidation.js";
import { objectToSnakeCase } from "../utils/transform.js";

class EventService {
  async getAllEvents() {
    const events = await db.select().from(event).orderBy(desc(event.date));
    const eventsWithCounts = await Promise.all(
      events.map(async (eventItem) => {
        const tagsResult = await db
          .select({ id: tag.id, name: tag.name, color: tag.color })
          .from(eventTag)
          .innerJoin(tag, eq(eventTag.tagId, tag.id))
          .where(eq(eventTag.eventId, eventItem.id));
        const [participantCount] = await db
          .select({ count: count() })
          .from(eventParticipant)
          .where(eq(eventParticipant.eventId, eventItem.id));
        const participantCountNumber = participantCount?.count ? Number(participantCount.count) : 0;
        return objectToSnakeCase({
          ...eventItem,
          participant_count: participantCountNumber,
          tags: tagsResult,
        });
      })
    );
    return eventsWithCounts;
  }

  async getEventById(id: number) {
    const [eventItem] = await db.select().from(event).where(eq(event.id, id)).limit(1);
    if (!eventItem) return null;
    const tagsResult = await db
      .select({ id: tag.id, name: tag.name, color: tag.color })
      .from(eventTag)
      .innerJoin(tag, eq(eventTag.tagId, tag.id))
      .where(eq(eventTag.eventId, id));
    const participantsResult = await db
      .select({
        id: participant.id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        phone: participant.phone,
        studyProgram: participant.studyProgram,
        notes: participant.notes,
        createdAt: participant.createdAt,
        updatedAt: participant.updatedAt,
        registeredAt: eventParticipant.registeredAt,
      })
      .from(eventParticipant)
      .innerJoin(participant, eq(eventParticipant.participantId, participant.id))
      .where(eq(eventParticipant.eventId, id));
    return objectToSnakeCase({
      ...eventItem,
      tags: tagsResult,
      participants: participantsResult,
    });
  }

  async createEvent(data: CreateEvent) {
    const [newEvent] = await db.insert(event).values(data).returning();
    return newEvent ? objectToSnakeCase(newEvent) : null;
  }

  async updateEvent(id: number, data: UpdateEvent) {
    const [updated] = await db.update(event).set(data).where(eq(event.id, id)).returning();
    return updated ? objectToSnakeCase(updated) : null;
  }

  async deleteEvent(id: number) {
    await db.delete(event).where(eq(event.id, id));
  }

  async addParticipantToEvent(eventId: number, participantId: number) {
    await db.insert(eventParticipant).values({ eventId, participantId });
  }

  async removeParticipantFromEvent(eventId: number, participantId: number) {
    await db
      .delete(eventParticipant)
      .where(
        and(
          eq(eventParticipant.eventId, eventId),
          eq(eventParticipant.participantId, participantId)
      ));
  }

  async addTagToEvent(eventId: number, tagId: number) {
    await db.insert(eventTag).values({ eventId, tagId });
  }

  async removeTagFromEvent(eventId: number, tagId: number) {
    await db.delete(eventTag).where(and(eq(eventTag.eventId, eventId), eq(eventTag.tagId, tagId)));
  }
}

export default EventService;
