import { z } from "zod";

export const createVendorLocationSchema = z.strictObject({
  district: z.string().min(2).max(100),
  city: z.string().min(2).max(100).optional(),
  area: z.string().min(2).max(150).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
});

export type CreateVendorLocationInput = z.infer<
  typeof createVendorLocationSchema
>;