import { Router } from "express";

import {
  getAllCategories,
  getCategory,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/service-category.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getAllCategories);

router.get("/:id", getCategory);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategoryController,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateCategoryController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCategoryController,
);

export default router;