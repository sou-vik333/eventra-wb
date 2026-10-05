import { Temporal } from "@js-temporal/polyfill";

import {
  createBooking,
  findBookingForCustomer,
  findBookingForVendor,
  findEventById,
  getBookingsByEventId,
  getBookingsByVendorId,
  updateBookingStatus,
} from "../repositories/booking.repository.js";

import {
  findVendorById,
  findVendorByUserId,
} from "../repositories/vendor.repository.js";

import { findServiceById } from "../repositories/service.repository.js";

import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from "../validators/booking.validator.js";

type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const allowedTransitions: Record<
  BookingStatus,
  BookingStatus[]
> = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["PAYMENT_PENDING", "CANCELLED"],
  REJECTED: [],
  PAYMENT_PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function validateStatusTransition(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus,
) {
  if (
    !allowedTransitions[currentStatus].includes(
      nextStatus,
    )
  ) {
    throw new Error(
      `Invalid booking status transition from ${currentStatus} to ${nextStatus}`,
    );
  }
}

function temporalInstantToDate(
  value: Temporal.Instant | null,
) {
  if (!value) {
    return null;
  }

  return new Date(value.epochMilliseconds);
}

export async function createCustomerBooking(
  userId: number,
  data: CreateBookingInput,
) {
  const event = await findEventById(data.eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error(
      "You do not have permission to book for this event",
    );
  }

  if (
    event.status === "CANCELLED" ||
    event.status === "COMPLETED"
  ) {
    throw new Error(
      "Cannot create a booking for a cancelled or completed event",
    );
  }

  const vendor = await findVendorById(data.vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status !== "ACTIVE") {
    throw new Error("Vendor is not currently active");
  }

  if (!vendor.isVerified) {
    throw new Error("Vendor is not verified");
  }

  const service = await findServiceById(data.serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  if (!service.isActive) {
    throw new Error("Service is not currently active");
  }

  if (service.vendorId !== vendor.id) {
    throw new Error(
      "Selected service does not belong to this vendor",
    );
  }

  const basePrice = Number(service.basePrice);
  const quantity = data.quantity ?? 1;

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    throw new Error("Invalid service price");
  }

  const totalAmount = basePrice * quantity;

  return createBooking({
    eventId: data.eventId,
    vendorId: data.vendorId,
    serviceId: data.serviceId,
    eventDate:
      data.eventDate ??
      temporalInstantToDate(event.eventDate),
    startTime: data.startTime ?? null,
    endTime: data.endTime ?? null,
    quantity,
    totalAmount,
    notes: data.notes ?? null,
  });
}

export async function getCustomerBooking(
  bookingId: number,
  userId: number,
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

  const vendor = await findVendorById(
    bookingData.booking.vendorId,
  );

  const service = await findServiceById(
    bookingData.booking.serviceId,
  );

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (!service) {
    throw new Error("Service not found");
  }

  return {
    ...bookingData.booking,
    event: bookingData.event,
    vendor: {
      id: vendor.id,
      businessName: vendor.businessName,
      description: vendor.description,
      phone: vendor.phone,
      email: vendor.email,
      status: vendor.status,
      isVerified: vendor.isVerified,
    },
    service: {
      id: service.id,
      categoryId: service.categoryId,
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      durationMinutes: service.durationMinutes,
      isActive: service.isActive,
    },
  };
}

export async function getCustomerEventBookings(
  eventId: number,
  userId: number,
) {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error(
      "You do not have permission to access this event",
    );
  }

  return getBookingsByEventId(eventId);
}

export async function getVendorBookings(userId: number) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return getBookingsByVendorId(vendor.id);
}

export async function updateVendorBookingStatus(
  userId: number,
  bookingId: number,
  data: UpdateBookingStatusInput,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const booking = await findBookingForVendor(
    bookingId,
    vendor.id,
  );

  if (!booking) {
    throw new Error(
      "Booking not found or you do not have permission to modify it",
    );
  }

  validateStatusTransition(
    booking.status,
    data.status,
  );

  return updateBookingStatus(
    bookingId,
    data.status,
  );
}

export async function moveBookingToPaymentPending(
  userId: number,
  bookingId: number,
) {
  const bookingData =
    await findBookingForCustomer(
      bookingId,
      userId,
    );

  if (!bookingData) {
    throw new Error(
      "Booking not found or you do not have permission to modify it",
    );
  }

  validateStatusTransition(
    bookingData.booking.status,
    "PAYMENT_PENDING",
  );

  return updateBookingStatus(
    bookingId,
    "PAYMENT_PENDING",
  );
}