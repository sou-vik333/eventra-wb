import {
  createPayment,
  createTransaction,
  findPaymentByBookingId,
  findPaymentById,
  updatePayment,
  getTransactionsByPaymentId,
  updateTransactionStatus,
} from "../repositories/payment.repository.js";

import {
  findBookingForCustomer,
  updateBookingStatus,
} from "../repositories/booking.repository.js";

import type {
  CreatePaymentInput,
} from "../validators/payment.validator.js";

import {
  createRazorpayOrder,
  fetchRazorpayOrder,
  fetchRazorpayPayment,
} from "./razorpay.service.js";

import {
  verifyRazorpaySignature,
} from "./razorpay.verification.service.js";

type PaymentMethod =
  | "RAZORPAY"
  | "CARD"
  | "UPI"
  | "NET_BANKING"
  | "OTHER";

type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

const allowedPaymentTransitions: Record<
  PaymentStatus,
  PaymentStatus[]
> = {
  PENDING: ["PROCESSING", "FAILED"],
  PROCESSING: ["SUCCESS", "FAILED"],
  SUCCESS: ["REFUNDED"],
  FAILED: ["PENDING"],
  REFUNDED: [],
};

function validatePaymentStatusTransition(
  currentStatus: PaymentStatus,
  nextStatus: PaymentStatus,
) {
  if (
    !allowedPaymentTransitions[currentStatus].includes(
      nextStatus,
    )
  ) {
    throw new Error(
      `Invalid payment status transition from ${currentStatus} to ${nextStatus}`,
    );
  }
}

export async function createCustomerPayment(
  userId: number,
  bookingId: number,
) {
  const bookingData = await findBookingForCustomer(
    bookingId,
    userId,
  );

  if (!bookingData) {
    throw new Error(
      "Booking not found or you do not have permission to access it",
    );
  }

  const booking = bookingData.booking;

  if (booking.status !== "PAYMENT_PENDING") {
    throw new Error(
      "Payment can only be created for a booking in PAYMENT_PENDING status",
    );
  }

  const existingPayment = await findPaymentByBookingId(
    bookingId,
  );

  if (existingPayment) {
    throw new Error(
      "A payment already exists for this booking",
    );
  }

  const amount = Number(booking.totalAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid booking amount");
  }

  return createPayment({
    bookingId: booking.id,
    amount,
    status: "PENDING",
  });
}

export async function processCustomerPayment(
  userId: number,
  data: CreatePaymentInput & {
    method: PaymentMethod;
  },
) {
  const bookingData = await findBookingForCustomer(
    data.bookingId,
    userId,
  );

  if (!bookingData) {
    throw new Error(
      "Booking not found or you do not have permission to access it",
    );
  }

  if (bookingData.booking.status !== "PAYMENT_PENDING") {
    throw new Error(
      "Payment cannot be processed for this booking",
    );
  }

  const payment = await findPaymentByBookingId(
    data.bookingId,
  );

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "SUCCESS") {
    throw new Error("Payment has already been completed");
  }

  if (payment.status === "REFUNDED") {
    throw new Error("Refunded payment cannot be processed");
  }

  const amount = Number(payment.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  validatePaymentStatusTransition(
    payment.status,
    "PROCESSING",
  );

  const updatedPayment = await updatePayment(
    payment.id,
    {
      status: "PROCESSING",
      method: data.method,
    },
  );

  const transaction = await createTransaction({
    paymentId: payment.id,
    gateway: "INTERNAL",
    amount,
    status: "PROCESSING",
    metadata: JSON.stringify({
      source: "payment-processing-test",
    }),
  });

  return {
    payment: updatedPayment,
    transaction,
  };
}

export async function getCustomerPayment(
  userId: number,
  paymentId: number,
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  const bookingData = await findBookingForCustomer(
    payment.bookingId,
    userId,
  );

  if (!bookingData) {
    throw new Error(
      "Payment not found or you do not have permission to access it",
    );
  }

  return payment;
}

export async function getCustomerPaymentTransactions(
  userId: number,
  paymentId: number,
) {
  const payment = await getCustomerPayment(
    userId,
    paymentId,
  );

  const transactions = await getTransactionsByPaymentId(
    payment.id,
  );

  return {
    payment,
    transactions,
  };
}

export async function updatePaymentStatus(
  paymentId: number,
  nextStatus: PaymentStatus,
  transactionId?: string | null,
  paidAt?: Date | null,
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  validatePaymentStatusTransition(
    payment.status,
    nextStatus,
  );

  const updatedPayment = await updatePayment(
    payment.id,
    {
      status: nextStatus,
      transactionId,
      paidAt:
        nextStatus === "SUCCESS"
          ? paidAt ?? new Date()
          : paidAt,
    },
  );

  return updatedPayment;
}

export async function createCustomerRazorpayOrder(
  userId: number,
  paymentId: number,
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  const bookingData = await findBookingForCustomer(
    payment.bookingId,
    userId,
  );

  if (!bookingData) {
    throw new Error(
      "Payment not found or you do not have permission to access it",
    );
  }

  if (
    payment.status !== "PENDING" &&
    payment.status !== "PROCESSING"
  ) {
    throw new Error(
      "Razorpay order cannot be created for this payment status",
    );
  }

  if (payment.razorpayOrderId) {
    const existingOrder =
      await fetchRazorpayOrder(
        payment.razorpayOrderId,
      );

    return {
      payment,
      order: existingOrder,
    };
  }

  const amount = Number(payment.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const receipt = `eventra_payment_${payment.id}`;

  const order = await createRazorpayOrder(
    amount,
    receipt,
  );

  const updatedPayment = await updatePayment(
    payment.id,
    {
      razorpayOrderId: order.id,
    },
  );

  return {
    payment: updatedPayment,
    order,
  };
}

export async function verifyCustomerRazorpayPayment(
  userId: number,
  data: {
    paymentId: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
) {
  const payment = await findPaymentById(data.paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  const bookingData = await findBookingForCustomer(
    payment.bookingId,
    userId,
  );

  if (!bookingData) {
    throw new Error(
      "Payment not found or you do not have permission to access it",
    );
  }

  if (!payment.razorpayOrderId) {
    throw new Error(
      "Razorpay order ID is not stored for this payment",
    );
  }

  if (
    payment.razorpayOrderId !==
    data.razorpayOrderId
  ) {
    throw new Error(
      "Razorpay order ID does not match the payment",
    );
  }

  if (payment.status === "SUCCESS") {
    throw new Error("Payment has already been completed");
  }

  if (payment.status === "REFUNDED") {
    throw new Error(
      "Refunded payment cannot be verified",
    );
  }

  const isValidSignature =
    verifyRazorpaySignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature,
    );

  if (!isValidSignature) {
    throw new Error(
      "Invalid Razorpay payment signature",
    );
  }

  const razorpayPayment =
    await fetchRazorpayPayment(
      data.razorpayPaymentId,
    );

  if (
    razorpayPayment.order_id !==
    data.razorpayOrderId
  ) {
    throw new Error(
      "Razorpay payment does not belong to this order",
    );
  }

  if (razorpayPayment.currency !== "INR") {
    throw new Error(
      "Razorpay payment currency does not match INR",
    );
  }

  const expectedAmount =
    Math.round(Number(payment.amount) * 100);

  if (
    razorpayPayment.amount !==
    expectedAmount
  ) {
    throw new Error(
      "Razorpay payment amount does not match the Eventra payment",
    );
  }

  if (razorpayPayment.status !== "captured") {
    throw new Error(
      `Razorpay payment is not captured. Current status: ${razorpayPayment.status}`,
    );
  }

  const updatedPayment = await updatePayment(
    payment.id,
    {
      status: "SUCCESS",
      method: "RAZORPAY",
      transactionId:
        data.razorpayPaymentId,
      paidAt: new Date(),
    },
  );

  const transactions =
    await getTransactionsByPaymentId(
      payment.id,
    );

  const processingTransaction =
    transactions.find(
      (transaction) =>
        transaction.status === "PROCESSING",
    );

  let transaction;

  if (processingTransaction) {
    transaction =
      await updateTransactionStatus(
        processingTransaction.id,
        {
          status: "SUCCESS",
          gatewayId:
            data.razorpayPaymentId,
          metadata: JSON.stringify({
            razorpayOrderId:
              data.razorpayOrderId,
          }),
        },
      );
  } else {
    transaction =
      await createTransaction({
        paymentId: payment.id,
        gateway: "RAZORPAY",
        gatewayId:
          data.razorpayPaymentId,
        amount: Number(payment.amount),
        status: "SUCCESS",
        metadata: JSON.stringify({
          razorpayOrderId:
            data.razorpayOrderId,
        }),
      });
  }

  await updateBookingStatus(
    payment.bookingId,
    "CONFIRMED",
  );

  return {
    payment: updatedPayment,
    transaction,
  };
}