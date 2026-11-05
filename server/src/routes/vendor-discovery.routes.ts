import { Router } from "express";

import {
  getActiveVendorsController,
  getActiveVendorsByCategoryController,
  getPublicVendorDetailsController,
  searchVendorsController,
} from "../controllers/vendor-discovery.controller.js";

const router = Router();

router.get(
  "/search",
  searchVendorsController,
);

router.get(
  "/",
  getActiveVendorsController,
);

router.get(
  "/category/:categoryId",
  getActiveVendorsByCategoryController,
);

router.get(
  "/:vendorId",
  getPublicVendorDetailsController,
);

export default router;