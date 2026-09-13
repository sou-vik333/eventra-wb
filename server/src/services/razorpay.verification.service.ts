import crypto from "crypto";

import {
  razorpayConfig,
} from "../config/razorpay.js";

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  if (!orderId.trim()) {
    throw new Error(
      "Razorpay order ID is required",
    );
  }

  if (!paymentId.trim()) {
    throw new Error(
      "Razorpay payment ID is required",
    );
  }

  if (!signature.trim()) {
    throw new Error(
      "Razorpay signature is required",
    );
  }

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        razorpayConfig.keySecret,
      )
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

  const generatedBuffer =
    Buffer.from(generatedSignature);

  const receivedBuffer =
    Buffer.from(signature);

  if (
    generatedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    generatedBuffer,
    receivedBuffer,
  );
}