import { z } from "zod";

export const packageServiceInputSchema =
  z.strictObject({
    serviceId: z.number().int().positive(),
    quantity: z.number().int().positive(),
  });

export const createPackageSchema =
  z.strictObject({
    name: z.string().min(2).max(150),
    description: z.string().max(1000).optional(),
    price: z.number().positive(),
    services: z
      .array(packageServiceInputSchema)
      .min(1),
  });

export const updatePackageSchema =
  z.strictObject({
    name: z.string().min(2).max(150).optional(),
    description: z.string().max(1000).optional(),
    price: z.number().positive().optional(),
    isActive: z.boolean().optional(),
    services: z
      .array(packageServiceInputSchema)
      .min(1)
      .optional(),
  });

export type CreatePackageInput =
  z.infer<typeof createPackageSchema>;

export type UpdatePackageInput =
  z.infer<typeof updatePackageSchema>;