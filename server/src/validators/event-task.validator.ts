import { z } from "zod";

const eventTaskStatuses = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export const createEventTaskSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateEventTaskSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.coerce.date().nullable().optional(),
  status: z.enum(eventTaskStatuses).optional(),
});

export type CreateEventTaskInput = z.infer<
  typeof createEventTaskSchema
>;

export type UpdateEventTaskInput = z.infer<
  typeof updateEventTaskSchema
>;