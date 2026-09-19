import {
  createEvent,
  deleteEvent,
  findEventById,
  findEventsByUserId,
  updateEvent,
} from "../repositories/event.repository.js";

import type {
  CreateEventInput,
  UpdateEventInput,
} from "../validators/event.validator.js";

export async function createCustomerEvent(
  userId: number,
  data: CreateEventInput,
) {
  return createEvent({
    userId,
    name: data.name,
    type: data.type,
    description: data.description,
    eventDate: data.eventDate,
    guestCount: data.guestCount,
    budget: data.budget?.toString(),
    budgetNotes: data.budgetNotes,
    locationId: data.locationId,
  });
}

export async function getCustomerEvents(userId: number) {
  return findEventsByUserId(userId);
}

export async function getCustomerEvent(
  userId: number,
  eventId: number,
) {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error("You do not have permission to access this event");
  }

  return event;
}

export async function updateCustomerEvent(
  userId: number,
  eventId: number,
  data: UpdateEventInput,
) {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error("You do not have permission to modify this event");
  }

  return updateEvent(eventId, {
    name: data.name,
    type: data.type,
    description: data.description,
    eventDate: data.eventDate,
    guestCount: data.guestCount,
    budget: data.budget?.toString(),
    budgetNotes: data.budgetNotes,
    locationId: data.locationId,
  });
}

export async function deleteCustomerEvent(
  userId: number,
  eventId: number,
) {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error("You do not have permission to delete this event");
  }

  return deleteEvent(eventId);
}