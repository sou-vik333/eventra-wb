import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createCustomerReview,
  deleteCustomerReview,
  listAllVendorReviews,
  listVendorReviews,
  updateCustomerReview,
} from "../services/review.service.js";

import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator.js";

export async function createReviewController(
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

    const input =
      createReviewSchema.parse(req.body);

    const review =
      await createCustomerReview(
        req.user.userId,
        input,
      );

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: {
        review,
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

export async function getVendorReviewsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const vendorId = Number(
      req.params.vendorId,
    );

    if (
      !Number.isInteger(vendorId) ||
      vendorId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const reviews =
      await listVendorReviews(vendorId);

    return res.status(200).json({
      success: true,
      data: {
        reviews,
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

export async function getMyVendorReviewsController(
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

    const reviews =
      await listAllVendorReviews(
        req.user.userId,
      );

    return res.status(200).json({
      success: true,
      data: {
        reviews,
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

export async function updateReviewController(
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

    const reviewId = Number(
      req.params.id,
    );

    if (
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const input =
      updateReviewSchema.parse(req.body);

    const review =
      await updateCustomerReview(
        req.user.userId,
        reviewId,
        input,
      );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: {
        review,
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

export async function deleteReviewController(
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

    const reviewId = Number(
      req.params.id,
    );

    if (
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    await deleteCustomerReview(
      req.user.userId,
      reviewId,
    );

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
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