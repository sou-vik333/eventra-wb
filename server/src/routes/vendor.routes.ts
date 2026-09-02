import { Router } from "express";

import {
  createVendor,
  getVendor,
  updateVendor,
} from "../controllers/vendor.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createVendor);
router.get("/me", authenticate, getVendor);
router.put("/me", authenticate, updateVendor);

export default router;