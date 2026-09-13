import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createVendorLocationProfile,
  deleteVendorLocationProfile,
  listVendorLocations,
} from "../services/vendor-location.service.js";

import {
  createVendorLocationSchema,
} from "../validators/vendor-location.validator.js";

export async function createVendorLocationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const input = createVendorLocationSchema.parse(req.body);

    const vendorLocation = await createVendorLocationProfile(
      req.user.userId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Vendor location added successfully",
      data: {
        vendorLocation,
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

export async function getMyVendorLocationsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const locations = await listVendorLocations(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        locations,
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

export async function deleteVendorLocationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const locationId = Number(req.params.locationId);

    if (!Number.isInteger(locationId) || locationId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid location ID",
      });
    }

    await deleteVendorLocationProfile(
      req.user.userId,
      locationId,
    );

    return res.status(200).json({
      success: true,
      message: "Vendor location deleted successfully",
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