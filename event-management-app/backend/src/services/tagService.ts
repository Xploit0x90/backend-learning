import { asc, count, eq } from "drizzle-orm";
import { db } from "../db.js";
import { tag, eventTag, event, eventParticipant } from "../db/schema.js";
import type { CreateTag, UpdateTag } from "../validators/tagValidation.js";
import { objectToSnakeCase } from "../utils/transform.js";

class TagService {
  async getAllTags() {
    const tagsList = await db.select().from(tag).orderBy(asc(tag.name));
    const withCounts = await Promise.all(
      tagsList.map(async (t) => {
        const [eventCount] = await db
          .select({ count: count() })
          .from(eventTag)
          .where(eq(eventTag.tagId, t.id));
        const eventCountNumber = eventCount?.count ? Number(eventCount.count) : 0;
        return objectToSnakeCase({ ...t, event_count: eventCountNumber });
      })
    );
    return withCounts;
  }

  async getTagById(id: number) {
    const [tagItem] = await db.select().from(tag).where(eq(tag.id, id)).limit(1);
    if (!tagItem) return null;
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
      })
      .from(eventTag)
      .innerJoin(event, eq(eventTag.eventId, event.id))
      .where(eq(eventTag.tagId, id));
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
    return objectToSnakeCase({ ...tagItem, events: eventsWithCounts });
  }

  async createTag(data: CreateTag) {
    const [newTag] = await db.insert(tag).values(data).returning();
    return newTag ? objectToSnakeCase(newTag) : null;
  }

  async updateTag(id: number, data: UpdateTag) {
    const [updated] = await db.update(tag).set(data).where(eq(tag.id, id)).returning();
    return updated ? objectToSnakeCase(updated) : null;
  }

  async deleteTag(id: number) {
    await db.delete(tag).where(eq(tag.id, id));
  }
}

export default TagService;
