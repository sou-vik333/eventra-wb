import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createVendorMedia,
  deleteVendorMedia,
  listVendorMedia,
  updateVendorMedia,
} from "../services/media.service.js";

import {
  createMediaSchema,
  updateMediaSchema,
} from "../validators/media.validator.js";

export async function createMediaController(
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

    const input = createMediaSchema.parse(req.body);

    const media = await createVendorMedia(
      req.user.userId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Media created successfully",
      data: {
        media,
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

export async function getMyMediaController(
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

    const media = await listVendorMedia(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        media,
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

export async function updateMediaController(
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

    const mediaId = Number(req.params.id);

    if (!Number.isInteger(mediaId) || mediaId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid media ID",
      });
    }

    const input = updateMediaSchema.parse(req.body);

    const media = await updateVendorMedia(
      req.user.userId,
      mediaId,
      input,
    );

    return res.status(200).json({
      success: true,
      message: "Media updated successfully",
      data: {
        media,
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

export async function deleteMediaController(
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

    const mediaId = Number(req.params.id);

    if (!Number.isInteger(mediaId) || mediaId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid media ID",
      });
    }

    await deleteVendorMedia(
      req.user.userId,
      mediaId,
    );

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
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