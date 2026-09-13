import { Router } from "express";

import {
  getActiveVendorsController,
  getActiveVendorsByCategoryController,
  getPublicVendorDetailsController,
  searchVendorsController,
} from "../controllers/vendor-discovery.controller.js";

const router = Router();

// Search and filter active vendors
router.get(
  "/search",
  searchVendorsController,
);

// Get all active and verified vendors
router.get(
  "/",
  getActiveVendorsController,
);

// Get active and verified vendors by service category
router.get(
  "/category/:categoryId",
  getActiveVendorsByCategoryController,
);

// Get one public active and verified vendor
router.get(
  "/:vendorId",
  getPublicVendorDetailsController,
);

export default router;