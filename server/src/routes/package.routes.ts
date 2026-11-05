import { Router } from "express";

import {
  createPackageController,
  deletePackageController,
  getActivePackagesController,
  getMyPackagesController,
  getPackageController,
  updatePackageController,
} from "../controllers/package.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/",
  getActivePackagesController,
);

router.get(
  "/me",
  authenticate,
  authorize("VENDOR"),
  getMyPackagesController,
);

router.get(
  "/:id",
  getPackageController,
);

router.post(
  "/",
  authenticate,
  authorize("VENDOR"),
  createPackageController,
);

router.put(
  "/:id",
  authenticate,
  authorize("VENDOR"),
  updatePackageController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("VENDOR"),
  deletePackageController,
);

export default router;