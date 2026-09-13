import {
  findPaymentByRazorpayOrderId,
  getTransactionsByPaymentId,
  createTransaction,
  updatePayment,
  updateTransactionStatus,
} from "../repositories/payment.repository.js";

import {
  updateBookingStatus,
} from "../repositories/booking.repository.js";

type RazorpayPaymentData = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
};

export async function processRazorpayPaymentCaptured(
  paymentData: RazorpayPaymentData,
) {
  const payment =
    await findPaymentByRazorpayOrderId(
      paymentData.order_id,
    );

  if (!payment) {
    throw new Error(
      "Eventra payment not found for Razorpay order",
    );
  }

  const expectedAmount =
    Math.round(Number(payment.amount) * 100);

  if (paymentData.amount !== expectedAmount) {
    throw new Error(
      "Razorpay payment amount does not match Eventra payment",
    );
  }

  if (paymentData.currency !== "INR") {
    throw new Error(
      "Razorpay payment currency does not match INR",
    );
  }

  if (paymentData.status !== "captured") {
    throw new Error(
      "Razorpay payment is not captured",
    );
  }

  if (payment.status === "SUCCESS") {
    return payment;
  }

  if (payment.status === "REFUNDED") {
    throw new Error(
      "Refunded payment cannot be marked as successful",
    );
  }

  const updatedPayment = await updatePayment(
    payment.id,
    {
      status: "SUCCESS",
      method: "RAZORPAY",
      transactionId: paymentData.id,
      paidAt: new Date(),
    },
  );

  const transactions =
    await getTransactionsByPaymentId(
      payment.id,
    );

  const existingTransaction =
    transactions.find(
      (transaction) =>
        transaction.gatewayId === paymentData.id,
    );

  let transaction;

  if (!existingTransaction) {
    transaction = await createTransaction({
      paymentId: payment.id,
      gateway: "RAZORPAY",
      gatewayId: paymentData.id,
      amount: Number(payment.amount),
      status: "SUCCESS",
      metadata: JSON.stringify({
        razorpayOrderId:
          paymentData.order_id,
      }),
    });
  } else if (
    existingTransaction.status !== "SUCCESS"
  ) {
    transaction =
      await updateTransactionStatus(
        existingTransaction.id,
        {
          status: "SUCCESS",
          gatewayId: paymentData.id,
          metadata: JSON.stringify({
            razorpayOrderId:
              paymentData.order_id,
          }),
        },
      );
  } else {
    transaction = existingTransaction;
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

export async function processRazorpayPaymentFailed(
  paymentData: RazorpayPaymentData,
) {
  const payment =
    await findPaymentByRazorpayOrderId(
      paymentData.order_id,
    );

  if (!payment) {
    throw new Error(
      "Eventra payment not found for Razorpay order",
    );
  }

  if (
    payment.status === "SUCCESS" ||
    payment.status === "REFUNDED"
  ) {
    return payment;
  }

  const updatedPayment = await updatePayment(
    payment.id,
    {
      status: "FAILED",
      method: "RAZORPAY",
      transactionId: paymentData.id,
    },
  );

  const transactions =
    await getTransactionsByPaymentId(
      payment.id,
    );

  const existingTransaction =
    transactions.find(
      (transaction) =>
        transaction.gatewayId === paymentData.id,
    );

  let transaction;

  if (!existingTransaction) {
    transaction = await createTransaction({
      paymentId: payment.id,
      gateway: "RAZORPAY",
      gatewayId: paymentData.id,
      amount: Number(payment.amount),
      status: "FAILED",
      metadata: JSON.stringify({
        razorpayOrderId:
          paymentData.order_id,
      }),
    });
  } else if (
    existingTransaction.status !== "FAILED"
  ) {
    transaction =
      await updateTransactionStatus(
        existingTransaction.id,
        {
          status: "FAILED",
          gatewayId: paymentData.id,
          metadata: JSON.stringify({
            razorpayOrderId:
              paymentData.order_id,
          }),
        },
      );
  } else {
    transaction = existingTransaction;
  }

  return {
    payment: updatedPayment,
    transaction,
  };
}