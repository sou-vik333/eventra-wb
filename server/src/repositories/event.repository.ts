import { Temporal } from "@js-temporal/polyfill";
import { db } from "../prisma/db.js";

const Event = db.orm.public.Event;

type EventType =
  | "WEDDING"
  | "RECEPTION"
  | "BIRTHDAY"
  | "ANNAPRASHAN"
  | "RICE_CEREMONY"
  | "BABY_SHOWER"
  | "ENGAGEMENT"
  | "ANNIVERSARY"
  | "HOUSEWARMING"
  | "PUJA"
  | "CULTURAL_PROGRAM"
  | "CORPORATE_EVENT"
  | "COLLEGE_EVENT"
  | "PARTY"
  | "FUNERAL"
  | "OTHER";

function toTemporalInstant(date: Date) {
  return Temporal.Instant.fromEpochMilliseconds(
    date.getTime(),
  );
}

export async function findEventById(id: number) {
  return Event.first({ id });
}

export async function findEventsByUserId(userId: number) {
  return Event.where({ userId }).all();
}

export async function createEvent(data: {
  userId: number;
  name: string;
  type: EventType;
  description?: string | null;
  eventDate?: Date | null;
  guestCount?: number | null;
  budget?: string | null;
  budgetNotes?: string | null;
  locationId?: number | null;
}) {
  return Event.create({
    userId: data.userId,
    name: data.name,
    type: data.type,
    description: data.description ?? null,
    eventDate: data.eventDate
      ? toTemporalInstant(data.eventDate)
      : null,
    guestCount: data.guestCount ?? null,
    budget: data.budget ?? null,
    budgetNotes: data.budgetNotes ?? null,
    locationId: data.locationId ?? null,
  });
}

export async function updateEvent(
  id: number,
  data: {
    name?: string;
    type?: EventType;
    description?: string | null;
    eventDate?: Date | null;
    guestCount?: number | null;
    budget?: string | null;
    budgetNotes?: string | null;
    locationId?: number | null;
  },
) {
  return Event.where({ id }).update({
    name: data.name,
    type: data.type,
    description: data.description,
    eventDate:
      data.eventDate !== undefined
        ? data.eventDate
          ? toTemporalInstant(data.eventDate)
          : null
        : undefined,
    guestCount: data.guestCount,
    budget: data.budget,
    budgetNotes: data.budgetNotes,
    locationId: data.locationId,
  });
}

export async function deleteEvent(id: number) {
  return Event.where({ id }).delete();
}