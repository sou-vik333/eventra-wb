import { db } from "../prisma/db.js";

const RazorpayWebhookEvent =
  db.orm.public.RazorpayWebhookEvent;

export async function findWebhookEvent(
  eventId: string,
) {
  return RazorpayWebhookEvent.first({
    eventId,
  });
}

export async function createWebhookEvent(data: {
  eventId: string;
  event: string;
}) {
  try {
    return await RazorpayWebhookEvent.create({
      eventId: data.eventId,
      event: data.event,
      status: "RECEIVED",
    });
  } catch (error) {
    const existingEvent =
      await findWebhookEvent(data.eventId);

    if (existingEvent) {
      return existingEvent;
    }

    throw error;
  }
}

export async function claimWebhookEvent(
  eventId: string,
) {
  return RazorpayWebhookEvent.where({
    eventId,
    status: "RECEIVED",
  }).update({
    status: "PROCESSING",
  });
}

export async function updateWebhookEventStatus(
  eventId: string,
  status:
    | "RECEIVED"
    | "PROCESSING"
    | "PROCESSED"
    | "FAILED",
) {
  return RazorpayWebhookEvent.where({
    eventId,
  }).update({
    status,
  });
}