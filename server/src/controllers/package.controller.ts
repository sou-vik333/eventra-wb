import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createVendorPackage,
  deleteVendorPackage,
  getPackage,
  listActivePackages,
  listVendorPackages,
  updateVendorPackage,
} from "../services/package.service.js";
import {
  createPackageSchema,
  updatePackageSchema,
} from "../validators/package.validator.js";

export async function createPackageController(
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

    const input = createPackageSchema.parse(req.body);

    const packageData = await createVendorPackage(
      req.user.userId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: packageData,
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
export async function getActivePackagesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const packages = await listActivePackages();

    return res.status(200).json({
      success: true,
      data: {
        packages,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve packages",
    });
  }
}
export async function getMyPackagesController(
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

    const packages = await listVendorPackages(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        packages,
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

export async function getPackageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const packageId = Number(req.params.id);

    if (!Number.isInteger(packageId) || packageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID",
      });
    }

    const packageData = await getPackage(packageId);

    return res.status(200).json({
      success: true,
      data: packageData,
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

export async function updatePackageController(
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

    const packageId = Number(req.params.id);

    if (!Number.isInteger(packageId) || packageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID",
      });
    }

    const input = updatePackageSchema.parse(req.body);

    const packageData = await updateVendorPackage(
      req.user.userId,
      packageId,
      input,
    );

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: packageData,
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

export async function deletePackageController(
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

    const packageId = Number(req.params.id);

    if (!Number.isInteger(packageId) || packageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID",
      });
    }

    await deleteVendorPackage(
      req.user.userId,
      packageId,
    );

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
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