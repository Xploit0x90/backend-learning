import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const event = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  date: timestamp("date").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  maxParticipants: integer("max_participants").default(50).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const participant = pgTable(
  "participants",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    studyProgram: varchar("study_program", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({ emailUnique: unique().on(table.email) })
);

export const tag = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    color: varchar("color", { length: 7 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({ nameUnique: unique().on(table.name) })
);

export const eventParticipant = pgTable(
  "event_participants",
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    participantId: integer("participant_id")
      .notNull()
      .references(() => participant.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.eventId, table.participantId] }),
  })
);

export const eventTag = pgTable(
  "event_tags",
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => ({ pk: primaryKey({ columns: [table.eventId, table.tagId] }) })
);

export const eventRelations = relations(event, ({ many }) => ({
  eventParticipants: many(eventParticipant),
  eventTags: many(eventTag),
}));

export const participantRelations = relations(participant, ({ many }) => ({
  eventParticipants: many(eventParticipant),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  eventTags: many(eventTag),
}));

export const eventParticipantRelations = relations(
  eventParticipant,
  ({ one }) => ({
    event: one(event, {
      fields: [eventParticipant.eventId],
      references: [event.id],
    }),
    participant: one(participant, {
      fields: [eventParticipant.participantId],
      references: [participant.id],
    }),
  })
);

export const eventTagRelations = relations(eventTag, ({ one }) => ({
  event: one(event, {
    fields: [eventTag.eventId],
    references: [event.id],
  }),
  tag: one(tag, {
    fields: [eventTag.tagId],
    references: [tag.id],
  }),
}));
