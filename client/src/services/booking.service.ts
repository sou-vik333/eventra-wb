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

export async function getEventBookings(
  eventId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/bookings/event/${eventId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
export type CreateBookingInput = {
  eventId: number;
  vendorId: number;
  serviceId: number;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  quantity?: number;
  notes?: string;
};
export async function createBooking(
  data: CreateBookingInput,
) {
  const response = await axios.post(
    `${API_BASE_URL}/bookings`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
export async function getBooking(
  bookingId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/bookings/${bookingId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
export async function getVendorBookings() {
  const response = await axios.get(
    `${API_BASE_URL}/bookings/vendor/me`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
export type UpdateBookingStatusInput = {
  status:
    | "ACCEPTED"
    | "REJECTED"
    | "PAYMENT_PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
};

export async function updateVendorBookingStatus(
  bookingId: number,
  data: UpdateBookingStatusInput,
) {
  const response = await axios.patch(
    `${API_BASE_URL}/bookings/${bookingId}/status`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
export async function moveBookingToPaymentPending(
  bookingId: number,
) {
  const response = await axios.post(
    `${API_BASE_URL}/bookings/${bookingId}/payment-pending`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}