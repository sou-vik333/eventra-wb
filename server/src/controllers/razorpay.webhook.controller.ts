import type { Request, Response } from "express";

import {
  verifyRazorpayWebhookSignature,
} from "../services/razorpay.webhook.service.js";

import {
  processRazorpayPaymentCaptured,
  processRazorpayPaymentFailed,
} from "../services/razorpay.webhook.payment.service.js";

import {
  findWebhookEvent,
  createWebhookEvent,
  claimWebhookEvent,
  updateWebhookEventStatus,
} from "../repositories/razorpay.webhook.repository.js";

export async function handleRazorpayWebhook(
  req: Request,
  res: Response,
) {
  try {
    const signature =
      req.headers["x-razorpay-signature"];

    if (typeof signature !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay webhook signature is missing",
      });
    }

    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid webhook request body",
      });
    }

    const isValid =
      verifyRazorpayWebhookSignature(
        req.body,
        signature,
      );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Razorpay webhook signature",
      });
    }

    const eventId =
      req.headers["x-razorpay-event-id"];

    if (typeof eventId !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay webhook event ID is missing",
      });
    }

    const payload = JSON.parse(
      req.body.toString("utf8"),
    );

    if (!payload.event) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay webhook event is missing",
      });
    }

    let existingEvent =
      await findWebhookEvent(eventId);

    if (!existingEvent) {
      existingEvent =
        await createWebhookEvent({
          eventId,
          event: payload.event,
        });
    }

    if (existingEvent.status === "PROCESSED") {
      return res.status(200).json({
        success: true,
        message:
          "Webhook event already processed",
        eventId,
      });
    }

    if (existingEvent.status === "PROCESSING") {
      return res.status(200).json({
        success: true,
        message:
          "Webhook event is already being processed",
        eventId,
      });
    }

    if (existingEvent.status === "FAILED") {
      await updateWebhookEventStatus(
        eventId,
        "RECEIVED",
      );
    }

    const claimedEvent =
      await claimWebhookEvent(eventId);

    if (!claimedEvent) {
      const currentEvent =
        await findWebhookEvent(eventId);

      if (
        currentEvent?.status ===
        "PROCESSED"
      ) {
        return res.status(200).json({
          success: true,
          message:
            "Webhook event already processed",
          eventId,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Webhook event is already being processed",
        eventId,
      });
    }

    try {
      const paymentEntity =
        payload?.payload?.payment?.entity;

      if (
        payload.event === "payment.captured"
      ) {
        if (!paymentEntity) {
          throw new Error(
            "Payment data is missing from webhook payload",
          );
        }

        await processRazorpayPaymentCaptured(
          paymentEntity,
        );
      }

      if (
        payload.event === "payment.failed"
      ) {
        if (!paymentEntity) {
          throw new Error(
            "Payment data is missing from webhook payload",
          );
        }

        await processRazorpayPaymentFailed(
          paymentEntity,
        );
      }

      await updateWebhookEventStatus(
        eventId,
        "PROCESSED",
      );

      return res.status(200).json({
        success: true,
        message:
          "Webhook processed successfully",
        eventId,
        event: payload.event,
      });
    } catch (error) {
      await updateWebhookEventStatus(
        eventId,
        "FAILED",
      );

      throw error;
    }
  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid webhook payload",
    });
  }
}