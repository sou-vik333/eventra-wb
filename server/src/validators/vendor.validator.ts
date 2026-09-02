import { z } from "zod";

export const createVendorSchema = z.object({
  businessName: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
});

export const updateVendorSchema = z.object({
  businessName: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;

export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;