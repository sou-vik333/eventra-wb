import { Temporal } from "@js-temporal/polyfill";
import { db } from "../prisma/db.js";

const Booking = db.orm.public.Booking;
const Event = db.orm.public.Event;

function toTemporalInstant(date: Date) {
  return Temporal.Instant.fromEpochMilliseconds(
    date.getTime(),
  );
}

export async function findBookingById(id: number) {
  return Booking.first({ id });
}

export async function findEventById(id: number) {
  return Event.first({ id });
}

export async function findBookingForCustomer(
  bookingId: number,
  userId: number,
) {
  const booking = await findBookingById(bookingId);

  if (!booking) {
    return null;
  }

  const event = await findEventById(booking.eventId);

  if (!event) {
    return null;
  }

  if (event.userId !== userId) {
    return null;
  }

  return {
    booking,
    event,
  };
}

export async function findBookingForVendor(
  bookingId: number,
  vendorId: number,
) {
  const booking = await Booking.first({
    id: bookingId,
    vendorId,
  });

  return booking;
}

export async function getBookingsByEventId(eventId: number) {
  return Booking.where({ eventId }).all();
}

export async function getBookingsByVendorId(vendorId: number) {
  return Booking.where({ vendorId }).all();
}

export async function getBookingsByServiceId(serviceId: number) {
  return Booking.where({ serviceId }).all();
}

export async function createBooking(data: {
  eventId: number;
  vendorId: number;
  serviceId: number;
  bookingDate?: Date;
  eventDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
  quantity?: number;
  totalAmount: number;
  notes?: string | null;
}) {
  return Booking.create({
    eventId: data.eventId,
    vendorId: data.vendorId,
    serviceId: data.serviceId,
    bookingDate: data.bookingDate
      ? toTemporalInstant(data.bookingDate)
      : Temporal.Now.instant(),
    eventDate: data.eventDate
      ? toTemporalInstant(data.eventDate)
      : null,
    startTime: data.startTime
      ? toTemporalInstant(data.startTime)
      : null,
    endTime: data.endTime
      ? toTemporalInstant(data.endTime)
      : null,
    quantity: data.quantity ?? 1,
    totalAmount: data.totalAmount.toString(),
    notes: data.notes ?? null,
    status: "PENDING",
  });
}

export async function updateBookingStatus(
  id: number,
  status:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "PAYMENT_PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED",
) {
  return Booking.where({ id }).update({
    status,
  });
}