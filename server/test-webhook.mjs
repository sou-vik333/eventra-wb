import "dotenv/config";
import crypto from "crypto";

const body = JSON.stringify({
  event: "payment.failed",
  payload: {
    payment: {
      entity: {
        id: "pay_webhook_failed_001",
        order_id: "order_TbRCQjuZ5mZeG1",
        amount: 2000000,
        currency: "INR",
        status: "failed",
      },
    },
  },
});

const signature = crypto
  .createHmac(
    "sha256",
    process.env.RAZORPAY_WEBHOOK_SECRET,
  )
  .update(body)
  .digest("hex");

const response = await fetch(
  "http://localhost:5000/api/v1/payments/webhook",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": signature,
      "x-razorpay-event-id":
        "evt_webhook_failed_001",
    },
    body,
  },
);

console.log("Status:", response.status);
console.log(await response.text());