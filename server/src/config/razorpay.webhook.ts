import "dotenv/config";

const razorpayWebhookSecret =
  process.env["RAZORPAY_WEBHOOK_SECRET"];

if (!razorpayWebhookSecret) {
  throw new Error(
    "RAZORPAY_WEBHOOK_SECRET is not configured",
  );
}

export const razorpayWebhookConfig = {
  secret: razorpayWebhookSecret,
};