import { Router } from "express";

import {
  createServiceController,
  deleteServiceController,
  getMyServices,
  getServiceController,
  getServicesByCategory,
  updateServiceController,
} from "../controllers/service.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/category/:categoryId",
  getServicesByCategory,
);

router.get(
  "/me",
  authenticate,
  authorize("VENDOR"),
  getMyServices,
);

router.get(
  "/:id",
  getServiceController,
);

router.post(
  "/",
  authenticate,
  authorize("VENDOR"),
  createServiceController,
);

router.put(
  "/:id",
  authenticate,
  authorize("VENDOR"),
  updateServiceController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("VENDOR"),
  deleteServiceController,
);

export default router;