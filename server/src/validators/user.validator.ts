import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;