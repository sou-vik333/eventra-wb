import { db } from "../prisma/db.js";

const Review = db.orm.public.Review;

export async function findReviewById(id: number) {
  return Review.first({
    id,
  });
}

export async function findReviewByBookingId(
  bookingId: number,
) {
  return Review.first({
    bookingId,
  });
}

export async function getReviewsByVendorId(
  vendorId: number,
) {
  return Review.where({
    vendorId,
  }).all();
}

export async function getPublishedReviewsByVendorId(
  vendorId: number,
) {
  return Review.where({
    vendorId,
    status: "PUBLISHED",
  }).all();
}

export async function createReview(data: {
  userId: number;
  vendorId: number;
  bookingId: number;
  rating: number;
  comment?: string | null;
  status?: "PENDING" | "PUBLISHED" | "HIDDEN" | "REJECTED";
}) {
  return Review.create({
    userId: data.userId,
    vendorId: data.vendorId,
    bookingId: data.bookingId,
    rating: data.rating,
    comment: data.comment ?? null,
    status: data.status ?? "PENDING",
  });
}

export async function updateReview(
  id: number,
  data: {
    rating?: number;
    comment?: string | null;
    status?: "PENDING" | "PUBLISHED" | "HIDDEN" | "REJECTED";
  },
) {
  return Review.where({
    id,
  }).update({
    ...(data.rating !== undefined && {
      rating: data.rating,
    }),

    ...(data.comment !== undefined && {
      comment: data.comment,
    }),

    ...(data.status !== undefined && {
      status: data.status,
    }),
  });
}

export async function deleteReview(id: number) {
  return Review.where({
    id,
  }).delete();
}