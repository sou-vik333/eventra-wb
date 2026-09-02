import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50).optional(),
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(6).max(100),
  phone: z.string().min(10).max(15).optional(),
  role: z.enum(["CUSTOMER", "VENDOR", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;