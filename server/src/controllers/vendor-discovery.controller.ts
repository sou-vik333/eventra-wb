import type { Request, Response } from "express";

import {
  getPublicVendorDetails,
  listActiveVendors,
  listActiveVendorsByCategory,
  searchVendors,
} from "../services/vendor-discovery.service.js";
import {
  vendorDiscoveryQuerySchema,
} from "../validators/vendor-discovery.validator.js";

export async function getActiveVendorsController(
  req: Request,
  res: Response,
) {
  try {
    const vendors = await listActiveVendors();

    return res.status(200).json({
      success: true,
      data: {
        vendors,
      },
    });
  } catch (error) {
    console.error("Error fetching active vendors:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function getActiveVendorsByCategoryController(
  req: Request,
  res: Response,
) {
  try {
    const categoryId = Number(req.params.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const vendors = await listActiveVendorsByCategory(categoryId);

    return res.status(200).json({
      success: true,
      data: {
        vendors,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching vendors by category:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function searchVendorsController(
  req: Request,
  res: Response,
) {
  try {
    const query = vendorDiscoveryQuerySchema.parse(req.query);

    const result = await searchVendors(query);

    return res.status(200).json({
      success: true,
      data: {
        vendors: result.vendors,
        pagination: result.pagination,
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

export async function getPublicVendorDetailsController(
  req: Request,
  res: Response,
) {
  try {
    const vendorId = Number(req.params.vendorId);

    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const result = await getPublicVendorDetails(vendorId);

    return res.status(200).json({
      success: true,
      data: {
        vendor: result.vendor,
        services: result.services,
        locations: result.locations,
        media: result.media,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Vendor not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(
      "Error fetching public vendor details:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}