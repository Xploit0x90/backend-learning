import { asc, count, eq } from "drizzle-orm";
import { db } from "../db.js";
import { participant, eventParticipant, event } from "../db/schema.js";
import type { CreateParticipant, UpdateParticipant } from "../validators/participantValidation.js";
import { objectToSnakeCase } from "../utils/transform.js";

class ParticipantService {
  async getAllParticipants() {
    const participantsList = await db
      .select()
      .from(participant)
      .orderBy(asc(participant.lastName), asc(participant.firstName));
    const withCounts = await Promise.all(
      participantsList.map(async (p) => {
        const [eventCount] = await db
          .select({ count: count() })
          .from(eventParticipant)
          .where(eq(eventParticipant.participantId, p.id));
        const eventCountNumber = eventCount?.count ? Number(eventCount.count) : 0;
        return objectToSnakeCase({ ...p, event_count: eventCountNumber });
      })
    );
    return withCounts;
  }

  async getParticipantById(id: number) {
    const [participantItem] = await db
      .select()
      .from(participant)
      .where(eq(participant.id, id))
      .limit(1);
    if (!participantItem) return null;
    const eventsResult = await db
      .select({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        imageUrl: event.imageUrl,
        maxParticipants: event.maxParticipants,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        registeredAt: eventParticipant.registeredAt,
      })
      .from(eventParticipant)
      .innerJoin(event, eq(eventParticipant.eventId, event.id))
      .where(eq(eventParticipant.participantId, id));
    const eventsWithCounts = await Promise.all(
      eventsResult.map(async (eventItem) => {
        const [participantCount] = await db
          .select({ count: count() })
          .from(eventParticipant)
          .where(eq(eventParticipant.eventId, eventItem.id));
        return {
          ...eventItem,
          participant_count: participantCount?.count ? Number(participantCount.count) : 0,
        };
      })
    );
    return objectToSnakeCase({
      ...participantItem,
      events: eventsWithCounts,
    });
  }

  async createParticipant(data: CreateParticipant) {
    const [newParticipant] = await db.insert(participant).values(data).returning();
    return newParticipant ? objectToSnakeCase(newParticipant) : null;
  }

  async updateParticipant(id: number, data: UpdateParticipant) {
    const [updated] = await db
      .update(participant)
      .set(data)
      .where(eq(participant.id, id))
      .returning();
    return updated ? objectToSnakeCase(updated) : null;
  }

  async deleteParticipant(id: number) {
    await db.delete(participant).where(eq(participant.id, id));
  }
}

export default ParticipantService;
