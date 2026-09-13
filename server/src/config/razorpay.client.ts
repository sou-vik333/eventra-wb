import Razorpay from "razorpay";
import { razorpayConfig } from "./razorpay.js";

export const razorpay = new Razorpay({
  key_id: razorpayConfig.keyId,
  key_secret: razorpayConfig.keySecret,
});