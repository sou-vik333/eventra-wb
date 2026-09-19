import { z } from "zod";

const eventTypes = [
  "WEDDING",
  "RECEPTION",
  "BIRTHDAY",
  "ANNAPRASHAN",
  "RICE_CEREMONY",
  "BABY_SHOWER",
  "ENGAGEMENT",
  "ANNIVERSARY",
  "HOUSEWARMING",
  "PUJA",
  "CULTURAL_PROGRAM",
  "CORPORATE_EVENT",
  "COLLEGE_EVENT",
  "PARTY",
  "FUNERAL",
  "OTHER",
] as const;

export const createEventSchema = z.object({
  name: z.string().min(2).max(150),

  type: z.enum(eventTypes),

  description: z.string().max(2000).optional(),

  eventDate: z.coerce.date().optional(),

  guestCount: z.number().int().positive().optional(),

  budget: z.number().nonnegative().optional(),

  budgetNotes: z.string().max(1000).optional(),

  locationId: z.number().int().positive().optional(),
});

export const updateEventSchema = z.object({
  name: z.string().min(2).max(150).optional(),

  type: z.enum(eventTypes).optional(),

  description: z.string().max(2000).optional(),

  eventDate: z.coerce.date().optional(),

  guestCount: z.number().int().positive().optional(),

  budget: z.number().nonnegative().optional(),

  budgetNotes: z.string().max(1000).optional(),

  locationId: z.number().int().positive().nullable().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export type UpdateEventInput = z.infer<typeof updateEventSchema>;