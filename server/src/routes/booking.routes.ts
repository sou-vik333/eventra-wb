import { Router } from "express";

import {
  createBookingController,
  getBookingController,
  getEventBookingsController,
  getVendorBookingsController,
  updateVendorBookingStatusController,
} from "../controllers/booking.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createBookingController,
);

router.get(
  "/vendor/me",
  authenticate,
  authorize("VENDOR"),
  getVendorBookingsController,
);

router.get(
  "/event/:eventId",
  authenticate,
  authorize("CUSTOMER"),
  getEventBookingsController,
);

router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  getBookingController,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("VENDOR"),
  updateVendorBookingStatusController,
);

export default router;