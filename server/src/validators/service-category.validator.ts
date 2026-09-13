import { z } from "zod";

export const createServiceCategorySchema = z.strictObject({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const updateServiceCategorySchema = z.strictObject({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceCategoryInput = z.infer<
  typeof createServiceCategorySchema
>;

export type UpdateServiceCategoryInput = z.infer<
  typeof updateServiceCategorySchema
>;