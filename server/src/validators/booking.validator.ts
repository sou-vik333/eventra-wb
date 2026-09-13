import { z } from "zod";

export const createBookingSchema = z
  .strictObject({
    eventId: z.number().int().positive(),
    vendorId: z.number().int().positive(),
    serviceId: z.number().int().positive(),
    eventDate: z.coerce.date().optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    quantity: z.number().int().positive().default(1),
    notes: z.string().max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.eventDate) {
      const now = new Date();

      if (data.eventDate < now) {
        ctx.addIssue({
          code: "custom",
          path: ["eventDate"],
          message: "Event date cannot be in the past",
        });
      }
    }

    const hasStartTime = data.startTime !== undefined;
    const hasEndTime = data.endTime !== undefined;

    if (hasStartTime !== hasEndTime) {
      ctx.addIssue({
        code: "custom",
        path: [hasStartTime ? "endTime" : "startTime"],
        message: "Start time and end time must be provided together",
      });
    }

    if (data.startTime && data.endTime) {
      if (data.endTime <= data.startTime) {
        ctx.addIssue({
          code: "custom",
          path: ["endTime"],
          message: "End time must be after start time",
        });
      }
    }
  });

export const updateBookingStatusSchema = z.strictObject({
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "REJECTED",
    "PAYMENT_PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;