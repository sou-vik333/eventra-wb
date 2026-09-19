import { Router } from "express";

import {
  createEventTaskController,
  deleteEventTaskController,
  getEventTasksController,
  updateEventTaskController,
} from "../controllers/event-task.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/event/:eventId",
  authenticate,
  authorize("CUSTOMER"),
  createEventTaskController,
);

router.get(
  "/event/:eventId",
  authenticate,
  authorize("CUSTOMER"),
  getEventTasksController,
);

router.put(
  "/:taskId",
  authenticate,
  authorize("CUSTOMER"),
  updateEventTaskController,
);

router.delete(
  "/:taskId",
  authenticate,
  authorize("CUSTOMER"),
  deleteEventTaskController,
);

export default router;