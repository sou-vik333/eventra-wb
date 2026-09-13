import { Router } from "express";

import {
  createMediaController,
  deleteMediaController,
  getMyMediaController,
  updateMediaController,
} from "../controllers/media.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Create vendor portfolio media
router.post(
  "/",
  authenticate,
  authorize("VENDOR"),
  createMediaController,
);

// Get logged-in vendor's media
router.get(
  "/me",
  authenticate,
  authorize("VENDOR"),
  getMyMediaController,
);

// Update vendor portfolio media
router.put(
  "/:id",
  authenticate,
  authorize("VENDOR"),
  updateMediaController,
);

// Delete vendor portfolio media
router.delete(
  "/:id",
  authenticate,
  authorize("VENDOR"),
  deleteMediaController,
);

export default router;