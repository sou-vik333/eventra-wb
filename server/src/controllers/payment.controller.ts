import type { Request, Response } from "express";

import {
  createCustomerPayment,
  processCustomerPayment,
  getCustomerPayment,
getCustomerPaymentByBookingId,
getCustomerPaymentTransactions,
  createCustomerRazorpayOrder,
  verifyCustomerRazorpayPayment,
} from "../services/payment.service.js";

import {
  createPaymentSchema,
  processPaymentSchema,
  verifyRazorpayPaymentSchema,
} from "../validators/payment.validator.js";

export async function createPayment(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const data = createPaymentSchema.parse(req.body);

    const payment = await createCustomerPayment(
      userId,
      data.bookingId,
    );

    return res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function processPayment(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const data = processPaymentSchema.parse(req.body);

    const result = await processCustomerPayment(
      userId,
      data,
    );

    return res.status(200).json({
      message: "Payment processing started",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getPayment(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const paymentId = Number(req.params.id);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const payment = await getCustomerPayment(
      userId,
      paymentId,
    );

    return res.status(200).json({
      message: "Payment retrieved successfully",
      payment,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function getPaymentByBookingId(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const bookingId = Number(
      req.params.bookingId,
    );

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const payment =
      await getCustomerPaymentByBookingId(
        userId,
        bookingId,
      );

    return res.status(200).json({
      message: "Payment retrieved successfully",
      payment,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function getPaymentTransactions(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const paymentId = Number(req.params.id);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const result = await getCustomerPaymentTransactions(
      userId,
      paymentId,
    );

    return res.status(200).json({
      message: "Payment transactions retrieved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createRazorpayOrder(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const paymentId = Number(req.params.id);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const result = await createCustomerRazorpayOrder(
      userId,
      paymentId,
    );

    return res.status(201).json({
      message: "Razorpay order created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function verifyRazorpayPayment(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const data = verifyRazorpayPaymentSchema.parse(
      req.body,
    );

    const result = await verifyCustomerRazorpayPayment(
      userId,
      data,
    );

    return res.status(200).json({
      message: "Razorpay payment verified successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}