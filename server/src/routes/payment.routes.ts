import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  handleRazorpayWebhook,
} from "../controllers/razorpay.webhook.controller.js";

import {
  createPayment,
  processPayment,
  getPayment,
  getPaymentTransactions,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post(
  "/webhook",
  handleRazorpayWebhook,
);

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createPayment,
);

router.post(
  "/process",
  authenticate,
  authorize("CUSTOMER"),
  processPayment,
);

router.post(
  "/verify-razorpay",
  authenticate,
  authorize("CUSTOMER"),
  verifyRazorpayPayment,
);

router.get(
  "/:id/transactions",
  authenticate,
  authorize("CUSTOMER"),
  getPaymentTransactions,
);

router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  getPayment,
);

router.post(
  "/:id/razorpay-order",
  authenticate,
  authorize("CUSTOMER"),
  createRazorpayOrder,
);

export default router;