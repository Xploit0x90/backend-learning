import { z } from "zod";

export const createTagZodSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required" }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Color must be HEX (e.g. #FF5733)" }),
});

export const updateTagZodSchema = z
  .object({
    name: z.string().min(1).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field required" });

export type CreateTag = z.infer<typeof createTagZodSchema>;
export type UpdateTag = z.infer<typeof updateTagZodSchema>;
