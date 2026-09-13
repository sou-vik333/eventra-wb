import { z } from "zod";

export const createMediaSchema = z.strictObject({
  title: z.string().min(2).max(150).optional(),

  description: z.string().max(1000).optional(),

  url: z.string().url(),

  publicId: z.string().max(255).optional(),

  type: z.enum([
    "IMAGE",
    "VIDEO",
    "REEL",
  ]),
});

export const updateMediaSchema = z.strictObject({
  title: z.string().min(2).max(150).optional(),

  description: z.string().max(1000).optional(),

  url: z.string().url().optional(),

  publicId: z.string().max(255).optional(),

  type: z.enum([
    "IMAGE",
    "VIDEO",
    "REEL",
  ]).optional(),

  isActive: z.boolean().optional(),
});

export type CreateMediaInput = z.infer<
  typeof createMediaSchema
>;

export type UpdateMediaInput = z.infer<
  typeof updateMediaSchema
>;