import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createCustomerBooking,
  getCustomerBooking,
  getCustomerEventBookings,
  getVendorBookings,
  updateVendorBookingStatus,
  moveBookingToPaymentPending,
} from "../services/booking.service.js";

import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validators/booking.validator.js";

export async function createBookingController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const input = createBookingSchema.parse(req.body);

    const booking = await createCustomerBooking(
      req.user.userId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function getBookingController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookingId = Number(req.params.id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await getCustomerBooking(
      bookingId,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function getEventBookingsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const eventId = Number(req.params.eventId);

    if (
      !Number.isInteger(eventId) ||
      eventId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const bookings =
      await getCustomerEventBookings(
        eventId,
        req.user.userId,
      );

    return res.status(200).json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function getVendorBookingsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookings = await getVendorBookings(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function updateVendorBookingStatusController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookingId = Number(req.params.id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const input =
      updateBookingStatusSchema.parse(
        req.body,
      );

    const booking =
      await updateVendorBookingStatus(
        req.user.userId,
        bookingId,
        input,
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking status updated successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function moveBookingToPaymentPendingController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookingId = Number(req.params.id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking =
      await moveBookingToPaymentPending(
        req.user.userId,
        bookingId,
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking is ready for payment",
      data: {
        booking,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}