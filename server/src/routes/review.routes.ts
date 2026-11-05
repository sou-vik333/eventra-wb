import { Router } from "express";

import {
  createReviewController,
  deleteReviewController,
  getMyVendorReviewsController,
  getVendorReviewsController,
  updateReviewController,
} from "../controllers/review.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createReviewController,
);

router.get(
  "/vendor/me",
  authenticate,
  authorize("VENDOR"),
  getMyVendorReviewsController,
);

router.get(
  "/vendor/:vendorId",
  getVendorReviewsController,
);

router.patch(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  updateReviewController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  deleteReviewController,
);

export default router;