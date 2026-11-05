import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getVendorReviews(
  vendorId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/reviews/vendor/${vendorId}`,
  );

  return response.data;
}
export async function getMyVendorReviews() {
  const response = await axios.get(
    `${API_BASE_URL}/reviews/vendor/me`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export type CreateReviewInput = {
  bookingId: number;
  rating: number;
  comment?: string;
};

export async function createReview(
  data: CreateReviewInput,
) {
  const response = await axios.post(
    `${API_BASE_URL}/reviews`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export type UpdateReviewInput = {
  rating?: number;
  comment?: string;
};

export async function updateReview(
  reviewId: number,
  data: UpdateReviewInput,
) {
  const response = await axios.patch(
    `${API_BASE_URL}/reviews/${reviewId}`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteReview(
  reviewId: number,
) {
  const response = await axios.delete(
    `${API_BASE_URL}/reviews/${reviewId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}