import { Router } from "express";

import {
  createVendor,
  getVendor,
  getVendorByIdController,
  updateVendor,
} from "../controllers/vendor.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  authorize("VENDOR"),
  getVendor,
);

router.get(
  "/:id",
  getVendorByIdController,
);

router.post(
  "/",
  authenticate,
  authorize("VENDOR"),
  createVendor,
);

router.put(
  "/me",
  authenticate,
  authorize("VENDOR"),
  updateVendor,
);

export default router;