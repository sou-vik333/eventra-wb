import { z } from "zod";

export const createPaymentSchema = z.strictObject({
  bookingId: z.number().int().positive(),
});

export const processPaymentSchema = z.strictObject({
  bookingId: z.number().int().positive(),
  method: z.enum([
    "RAZORPAY",
    "CARD",
    "UPI",
    "NET_BANKING",
    "OTHER",
  ]),
});

export const verifyRazorpayPaymentSchema = z.strictObject({
  paymentId: z.number().int().positive(),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type CreatePaymentInput = z.infer<
  typeof createPaymentSchema
>;

export type ProcessPaymentInput = z.infer<
  typeof processPaymentSchema
>;

export type VerifyRazorpayPaymentInput = z.infer<
  typeof verifyRazorpayPaymentSchema
>;