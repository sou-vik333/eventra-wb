import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createVendorProfile,
  getVendorById,
  getVendorProfile,
  updateVendorProfile,
} from "../services/vendor.service.js";

import {
  createVendorSchema,
  updateVendorSchema,
} from "../validators/vendor.validator.js";

export async function createVendor(
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

    const input = createVendorSchema.parse(req.body);

    const vendor = await createVendorProfile(
      req.user.userId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      data: {
        vendor,
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

export async function getVendor(
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

    const vendor = await getVendorProfile(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        vendor,
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

export async function getVendorByIdController(
  req: Request,
  res: Response,
) {
  try {
    const vendorId = Number(req.params.id);

    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const vendor = await getVendorById(
      vendorId,
    );

    return res.status(200).json({
      success: true,
      data: {
        vendor,
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

export async function updateVendor(
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

    const input = updateVendorSchema.parse(req.body);

    const vendor = await updateVendorProfile(
      req.user.userId,
      input,
    );

    return res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      data: {
        vendor,
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