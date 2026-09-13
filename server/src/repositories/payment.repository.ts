import { Temporal } from "@js-temporal/polyfill";

import { db } from "../prisma/db.js";

const Payment = db.orm.public.Payment;

const Transaction = db.orm.public.Transaction;

export async function findPaymentById(id: number) {
  return Payment.first({ id });
}

export async function findPaymentByBookingId(
  bookingId: number,
) {
  return Payment.first({ bookingId });
}

export async function findPaymentByRazorpayOrderId(
  razorpayOrderId: string,
) {
  return Payment.first({
    razorpayOrderId,
  });
}

export async function createPayment(data: {
  bookingId: number;
  amount: number;
  status?:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "REFUNDED";
  method?:
    | "RAZORPAY"
    | "CARD"
    | "UPI"
    | "NET_BANKING"
    | "OTHER"
    | null;
  transactionId?: string | null;
  razorpayOrderId?: string | null;
}) {
  return Payment.create({
    bookingId: data.bookingId,
    amount: data.amount.toString(),
    status: data.status ?? "PENDING",
    method: data.method ?? null,
    transactionId: data.transactionId ?? null,
    razorpayOrderId: data.razorpayOrderId ?? null,
    paidAt: null,
  });
}

export async function updatePayment(
  id: number,
  data: {
    status?:
      | "PENDING"
      | "PROCESSING"
      | "SUCCESS"
      | "FAILED"
      | "REFUNDED";
    method?:
      | "RAZORPAY"
      | "CARD"
      | "UPI"
      | "NET_BANKING"
      | "OTHER"
      | null;
    transactionId?: string | null;
    razorpayOrderId?: string | null;
    paidAt?: Date | null;
  },
) {
  return Payment.where({ id }).update({
    ...(data.status !== undefined && {
      status: data.status,
    }),
    ...(data.method !== undefined && {
      method: data.method,
    }),
    ...(data.transactionId !== undefined && {
      transactionId: data.transactionId,
    }),
    ...(data.razorpayOrderId !== undefined && {
      razorpayOrderId: data.razorpayOrderId,
    }),
    ...(data.paidAt !== undefined && {
      paidAt: data.paidAt
        ? Temporal.Instant.fromEpochMilliseconds(
            data.paidAt.getTime(),
          )
        : null,
    }),
  });
}

export async function createTransaction(data: {
  paymentId: number;
  gateway: string;
  gatewayId?: string | null;
  amount: number;
  status?:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "REFUNDED";
  metadata?: string | null;
}) {
  return Transaction.create({
    paymentId: data.paymentId,
    gateway: data.gateway,
    gatewayId: data.gatewayId ?? null,
    amount: data.amount.toString(),
    status: data.status ?? "PENDING",
    metadata: data.metadata ?? null,
  });
}

export async function getTransactionsByPaymentId(
  paymentId: number,
) {
  return Transaction.where({ paymentId }).all();
}

export async function updateTransactionStatus(
  id: number,
  data: {
    status?:
      | "PENDING"
      | "PROCESSING"
      | "SUCCESS"
      | "FAILED"
      | "REFUNDED";
    gatewayId?: string | null;
    metadata?: string | null;
  },
) {
  return Transaction.where({ id }).update({
    ...(data.status !== undefined && {
      status: data.status,
    }),
    ...(data.gatewayId !== undefined && {
      gatewayId: data.gatewayId,
    }),
    ...(data.metadata !== undefined && {
      metadata: data.metadata,
    }),
  });
}