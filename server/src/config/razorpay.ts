import "dotenv/config";

const razorpayKeyId = process.env["RAZORPAY_KEY_ID"];
const razorpayKeySecret = process.env["RAZORPAY_KEY_SECRET"];

if (!razorpayKeyId) {
  throw new Error("RAZORPAY_KEY_ID is not configured");
}

if (!razorpayKeySecret) {
  throw new Error("RAZORPAY_KEY_SECRET is not configured");
}

export const razorpayConfig = {
  keyId: razorpayKeyId,
  keySecret: razorpayKeySecret,
};