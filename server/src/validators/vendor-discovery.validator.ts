import { z } from "zod";

export const vendorDiscoveryQuerySchema = z
  .strictObject({
    categoryId: z.coerce.number().int().positive().optional(),

    district: z.string().min(2).max(100).optional(),

    city: z.string().min(2).max(100).optional(),

    area: z.string().min(2).max(150).optional(),

    pincode: z
      .string()
      .regex(/^\d{6}$/)
      .optional(),

    minPrice: z.coerce.number().nonnegative().optional(),

    maxPrice: z.coerce.number().nonnegative().optional(),

    sort: z
      .enum([
        "newest",
        "price_low",
        "price_high",
      ])
      .default("newest"),

    page: z.coerce
      .number()
      .int()
      .positive()
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(50)
      .default(10),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    },
  );

export type VendorDiscoveryQuery = z.infer<
  typeof vendorDiscoveryQuerySchema
>;