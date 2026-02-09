import { z } from "zod";

export const createParticipantZodSchema = z
  .object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    phone: z.string().max(50).optional().or(z.literal("")),
    study_program: z.string().max(255).optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  })
  .transform((data) => ({
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone === "" ? null : data.phone,
    studyProgram: data.study_program === "" ? null : data.study_program,
    notes: data.notes === "" ? null : data.notes,
  }));

export const updateParticipantZodSchema = z
  .object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().max(50).optional().or(z.literal("")),
    study_program: z.string().max(255).optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  })
  .transform((data) => {
    const result: Record<string, unknown> = {};
    if (data.first_name !== undefined) result.firstName = data.first_name;
    if (data.last_name !== undefined) result.lastName = data.last_name;
    if (data.email !== undefined) result.email = data.email;
    if (data.phone !== undefined) result.phone = data.phone === "" ? null : data.phone;
    if (data.study_program !== undefined) result.studyProgram = data.study_program === "" ? null : data.study_program;
    if (data.notes !== undefined) result.notes = data.notes === "" ? null : data.notes;
    return result;
  });

export type CreateParticipant = z.infer<typeof createParticipantZodSchema>;
export type UpdateParticipant = z.infer<typeof updateParticipantZodSchema>;
