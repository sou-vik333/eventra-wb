import { Router } from "express";

import {
  createVendor,
  getVendor,
  updateVendor,
} from "../controllers/vendor.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("VENDOR"), createVendor);

router.get("/me", authenticate, authorize("VENDOR"), getVendor);

router.put("/me", authenticate, authorize("VENDOR"), updateVendor);

export default router;