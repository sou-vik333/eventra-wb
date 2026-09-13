import { Router } from "express";

import {
  createVendorLocationController,
  deleteVendorLocationController,
  getMyVendorLocationsController,
} from "../controllers/vendor-location.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  authorize("VENDOR"),
  getMyVendorLocationsController,
);

router.post(
  "/",
  authenticate,
  authorize("VENDOR"),
  createVendorLocationController,
);

router.delete(
  "/:locationId",
  authenticate,
  authorize("VENDOR"),
  deleteVendorLocationController,
);

export default router;