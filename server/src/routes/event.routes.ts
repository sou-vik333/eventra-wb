import { Router } from "express";

import {
  createEventController,
  getEventsController,
  getEventController,
  updateEventController,
  deleteEventController,
} from "../controllers/event.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createEventController,
);

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  getEventsController,
);

router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  getEventController,
);

router.put(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  updateEventController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  deleteEventController,
);

export default router;