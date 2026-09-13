import { razorpay } from "../config/razorpay.client.js";

export async function createRazorpayOrder(
  amount: number,
  receipt: string,
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  if (!receipt.trim()) {
    throw new Error("Receipt is required");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  });

  return order;
}

export async function fetchRazorpayOrder(
  orderId: string,
) {
  if (!orderId.trim()) {
    throw new Error("Razorpay order ID is required");
  }

  const order =
    await razorpay.orders.fetch(orderId);

  return order;
}

export async function fetchRazorpayPayment(
  paymentId: string,
) {
  if (!paymentId.trim()) {
    throw new Error("Razorpay payment ID is required");
  }

  const payment =
    await razorpay.payments.fetch(paymentId);

  return payment;
}