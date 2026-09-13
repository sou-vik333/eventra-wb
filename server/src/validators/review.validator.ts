import { z } from "zod";

export const createReviewSchema = z.strictObject({
  bookingId: z.number().int().positive(),

  rating: z.number().int().min(1).max(5),

  comment: z.string().max(2000).optional(),
});

export const updateReviewSchema = z.strictObject({
  rating: z.number().int().min(1).max(5).optional(),

  comment: z.string().max(2000).optional(),
});

export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;

export type UpdateReviewInput = z.infer<
  typeof updateReviewSchema
>;