import { z } from "zod";

const dateRefine = (val: unknown) => {
  if (val instanceof Date) return true;
  if (typeof val === "string") return !isNaN(new Date(val).getTime());
  return false;
};

export const createEventZodSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    location: z.string().min(1, { message: "Location is required" }),
    date: z.string().or(z.date()).refine(dateRefine, { message: "Invalid date format" }),
    image_url: z.string().url().max(500).optional().or(z.literal("")),
    max_participants: z.number().int().positive().default(50),
  })
  .transform((data) => ({
    title: data.title,
    description: data.description || null,
    location: data.location,
    date: typeof data.date === "string" ? new Date(data.date) : data.date,
    imageUrl: data.image_url === "" || !data.image_url ? null : data.image_url,
    maxParticipants: data.max_participants,
  }));

export const updateEventZodSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    location: z.string().min(1).optional(),
    date: z.string().or(z.date()).optional().refine((val) => val === undefined || dateRefine(val), { message: "Invalid date format" }),
    image_url: z.string().url().max(500).optional().or(z.literal("")),
    max_participants: z.number().int().positive().optional(),
  })
  .transform((data) => {
    const result: Record<string, unknown> = {};
    if (data.title !== undefined) result.title = data.title;
    if (data.description !== undefined) result.description = data.description || null;
    if (data.location !== undefined) result.location = data.location;
    if (data.date !== undefined) result.date = typeof data.date === "string" ? new Date(data.date) : data.date;
    if (data.image_url !== undefined) result.imageUrl = data.image_url === "" || !data.image_url ? null : data.image_url;
    if (data.max_participants !== undefined) result.maxParticipants = data.max_participants;
    return result;
  });

export type CreateEvent = z.infer<typeof createEventZodSchema>;
export type UpdateEvent = z.infer<typeof updateEventZodSchema>;
