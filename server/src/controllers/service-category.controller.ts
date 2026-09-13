import type { Request, Response } from "express";

import {
  createCategory,
  getServiceCategory,
  listServiceCategories,
  removeCategory,
  updateCategory,
} from "../services/service-category.service.js";

import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
} from "../validators/service-category.validator.js";

export async function getAllCategories(
  _req: Request,
  res: Response,
) {
  try {
    const categories = await listServiceCategories();

    return res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function getCategory(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await getServiceCategory(id);

    return res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function createCategoryController(
  req: Request,
  res: Response,
) {
  try {
    const input = createServiceCategorySchema.parse(req.body);

    const category = await createCategory(input);

    return res.status(201).json({
      success: true,
      message: "Service category created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function updateCategoryController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const input = updateServiceCategorySchema.parse(req.body);

    const category = await updateCategory(id, input);

    return res.status(200).json({
      success: true,
      message: "Service category updated successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function deleteCategoryController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    await removeCategory(id);

    return res.status(200).json({
      success: true,
      message: "Service category deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}