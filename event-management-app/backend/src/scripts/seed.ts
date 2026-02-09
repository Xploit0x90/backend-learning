import { db } from "../db.js";
import { event, eventParticipant, eventTag, participant, tag } from "../db/schema.js";

export async function seed(clearExisting: boolean = false) {
  if (clearExisting) {
    await db.delete(eventParticipant);
    await db.delete(eventTag);
    await db.delete(event);
    await db.delete(participant);
    await db.delete(tag);
  }

  const tags = await db
    .insert(tag)
    .values([
      { name: "Workshop", color: "#3B82F6" },
      { name: "Vortrag", color: "#10B981" },
      { name: "Networking", color: "#F59E0B" },
      { name: "Konferenz", color: "#8B5CF6" },
      { name: "Hackathon", color: "#EF4444" },
      { name: "Seminar", color: "#06B6D4" },
      { name: "Meetup", color: "#EC4899" },
      { name: "Ausstellung", color: "#14B8A6" },
    ])
    .returning();

  const participants = await db
    .insert(participant)
    .values([
      { firstName: "Max", lastName: "Mustermann", email: "max.mustermann@example.com", phone: "+49 123 456789", studyProgram: "Informatik", notes: "Interessiert an Webentwicklung" },
      { firstName: "Anna", lastName: "Schmidt", email: "anna.schmidt@example.com", phone: "+49 123 456790", studyProgram: "Wirtschaftsinformatik", notes: "Fokus auf Datenbanken" },
      { firstName: "Tom", lastName: "Weber", email: "tom.weber@example.com", phone: "+49 123 456791", studyProgram: "Medieninformatik" },
      { firstName: "Lisa", lastName: "Müller", email: "lisa.mueller@example.com", phone: "+49 123 456792", studyProgram: "Software Engineering", notes: "Spezialisiert auf React" },
      { firstName: "David", lastName: "Fischer", email: "david.fischer@example.com", phone: "+49 123 456793", studyProgram: "Informatik" },
      { firstName: "Sarah", lastName: "Wagner", email: "sarah.wagner@example.com", phone: "+49 123 456794", studyProgram: "Wirtschaftsinformatik", notes: "Interessiert an KI" },
      { firstName: "Michael", lastName: "Becker", email: "michael.becker@example.com", phone: "+49 123 456795", studyProgram: "Medieninformatik" },
      { firstName: "Julia", lastName: "Hoffmann", email: "julia.hoffmann@example.com", phone: "+49 123 456796", studyProgram: "Software Engineering" },
    ])
    .returning();

  const now = new Date();
  const events = await db
    .insert(event)
    .values([
      { title: "React Workshop für Anfänger", description: "Lerne die Grundlagen von React.", location: "Berlin", date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800", maxParticipants: 30 },
      { title: "Vortrag: Künstliche Intelligenz in der Praxis", description: "Anwendungen von KI.", location: "München", date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", maxParticipants: 100 },
      { title: "Networking Event: Meet & Greet", description: "Tausche dich mit anderen aus.", location: "Hamburg", date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800", maxParticipants: 50 },
      { title: "Hackathon: 48 Stunden Coding Challenge", description: "Entwickle in 48 Stunden eine Lösung.", location: "Frankfurt", date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800", maxParticipants: 40 },
      { title: "Seminar: Datenbankdesign Best Practices", description: "Design und Optimierung von Datenbanken.", location: "Stuttgart", date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800", maxParticipants: 25 },
      { title: "Konferenz: Zukunft der Webentwicklung", description: "Trends in der Webentwicklung.", location: "Köln", date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800", maxParticipants: 200 },
      { title: "TypeScript Meetup", description: "TypeScript und moderne JavaScript-Entwicklung.", location: "Düsseldorf", date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800", maxParticipants: 35 },
      { title: "Ausstellung: IT-Projekte der Studierenden", description: "Präsentation der besten IT-Projekte.", location: "Dresden", date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", maxParticipants: 150 },
    ])
    .returning();

  const tagEventLinks = [
    { eventIndex: 0, tagNames: ["Workshop", "Seminar"] },
    { eventIndex: 1, tagNames: ["Vortrag", "Konferenz"] },
    { eventIndex: 2, tagNames: ["Networking", "Meetup"] },
    { eventIndex: 3, tagNames: ["Hackathon", "Workshop"] },
    { eventIndex: 4, tagNames: ["Seminar", "Workshop"] },
    { eventIndex: 5, tagNames: ["Konferenz", "Vortrag"] },
    { eventIndex: 6, tagNames: ["Meetup", "Networking"] },
    { eventIndex: 7, tagNames: ["Ausstellung"] },
  ];
  for (const link of tagEventLinks) {
    const eventItem = events[link.eventIndex];
    for (const tagName of link.tagNames) {
      const tagItem = tags.find((t) => t.name === tagName);
      if (tagItem) await db.insert(eventTag).values({ eventId: eventItem.id, tagId: tagItem.id });
    }
  }

  const participantEventLinks = [
    { eventIndex: 0, participantIndices: [0, 1, 2, 3] },
    { eventIndex: 1, participantIndices: [1, 4, 5] },
    { eventIndex: 2, participantIndices: [0, 2, 4, 6, 7] },
    { eventIndex: 3, participantIndices: [0, 1, 2, 3, 4, 5] },
    { eventIndex: 4, participantIndices: [1, 5] },
    { eventIndex: 5, participantIndices: [0, 1, 2, 3, 4, 5, 6, 7] },
    { eventIndex: 6, participantIndices: [3, 4, 6] },
    { eventIndex: 7, participantIndices: [0, 1, 2, 3] },
  ];
  for (const link of participantEventLinks) {
    const eventItem = events[link.eventIndex];
    for (const i of link.participantIndices) {
      const p = participants[i];
      if (p) await db.insert(eventParticipant).values({ eventId: eventItem.id, participantId: p.id });
    }
  }

  console.log("Database seed completed.");
}
