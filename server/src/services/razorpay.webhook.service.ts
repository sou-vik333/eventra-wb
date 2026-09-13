import crypto from "crypto";

import {
  razorpayWebhookConfig,
} from "../config/razorpay.webhook.js";

export function verifyRazorpayWebhookSignature(
  rawBody: Buffer,
  signature: string,
) {
  if (!signature.trim()) {
    throw new Error(
      "Razorpay webhook signature is required",
    );
  }

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        razorpayWebhookConfig.secret,
      )
      .update(rawBody)
      .digest("hex");

  const expectedBuffer =
    Buffer.from(expectedSignature);

  const receivedBuffer =
    Buffer.from(signature);

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer,
  );
}