import { z } from "zod";

export const createServiceSchema = z.strictObject({
  categoryId: z.number().int().positive(),
  name: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
  basePrice: z.number().positive(),
  durationMinutes: z.number().int().positive().optional(),
});

export const updateServiceSchema = z.strictObject({
  categoryId: z.number().int().positive().optional(),
  name: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
  basePrice: z.number().positive().optional(),
  durationMinutes: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;