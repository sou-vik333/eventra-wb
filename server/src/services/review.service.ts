import {
  createReview,
  deleteReview,
  findReviewByBookingId,
  findReviewById,
  getPublishedReviewsByVendorId,
  getReviewsByVendorId,
  updateReview,
} from "../repositories/review.repository.js";

import {
  findVendorByUserId,
} from "../repositories/vendor.repository.js";

import {
  findBookingForCustomer,
} from "../repositories/booking.repository.js";

import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../validators/review.validator.js";

export async function createCustomerReview(
  userId: number,
  data: CreateReviewInput,
) {
  /*
   * Step 1:
   * Check whether this booking has already been reviewed.
   */
  const existingReview =
    await findReviewByBookingId(data.bookingId);

  if (existingReview) {
    throw new Error(
      "A review already exists for this booking",
    );
  }

  /*
   * Step 2:
   * Find the booking and verify that it belongs
   * to the currently authenticated customer.
   *
   * Booking ownership is determined through:
   *
   * Booking
   *    ↓ eventId
   * Event
   *    ↓ userId
   * Customer
   */
  const bookingData = await findBookingForCustomer(
    data.bookingId,
    userId,
  );

  if (!bookingData) {
    throw new Error(
      "Booking not found or you do not have permission to review it",
    );
  }

  const { booking } = bookingData;

  /*
   * Step 3:
   * Reviews are allowed only after the booking
   * has been completed.
   */
  if (booking.status !== "COMPLETED") {
    throw new Error(
      "You can only review a completed booking",
    );
  }

  /*
   * Step 4:
   * The vendorId is taken directly from the booking.
   *
   * The frontend does NOT provide vendorId.
   */
  return createReview({
    userId,
    vendorId: booking.vendorId,
    bookingId: booking.id,
    rating: data.rating,
    comment: data.comment ?? null,
    status: "PENDING",
  });
}


/*
 * Get only published reviews for a public vendor profile.
 */
export async function listVendorReviews(
  vendorId: number,
) {
  return getPublishedReviewsByVendorId(vendorId);
}


/*
 * Get all reviews belonging to the authenticated vendor.
 *
 * This can include:
 * PENDING
 * PUBLISHED
 * HIDDEN
 * REJECTED
 */
export async function listAllVendorReviews(
  userId: number,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return getReviewsByVendorId(vendor.id);
}


/*
 * Customer updates their own review.
 *
 * Whenever a published review is edited,
 * its status is reset to PENDING so that
 * it can be moderated again.
 */
export async function updateCustomerReview(
  userId: number,
  reviewId: number,
  data: UpdateReviewInput,
) {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  /*
   * Make sure the review belongs to
   * the authenticated customer.
   */
  if (review.userId !== userId) {
    throw new Error(
      "You do not have permission to modify this review",
    );
  }

  return updateReview(reviewId, {
    ...data,
    status: "PENDING",
  });
}


/*
 * Customer deletes their own review.
 */
export async function deleteCustomerReview(
  userId: number,
  reviewId: number,
) {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  /*
   * Make sure the review belongs to
   * the authenticated customer.
   */
  if (review.userId !== userId) {
    throw new Error(
      "You do not have permission to delete this review",
    );
  }

  await deleteReview(reviewId);
}