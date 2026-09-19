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

export async function createPayment(
  bookingId: number,
) {
  const response = await axios.post(
    `${API_BASE_URL}/payments`,
    {
      bookingId,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function getPayment(
  paymentId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/payments/${paymentId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
export async function getPaymentByBookingId(
  bookingId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/payments/booking/${bookingId}`,
    { headers: getAuthHeaders() },
  );

  return response.data;
}

export async function createRazorpayOrder(
  paymentId: number,
) {
  const response = await axios.post(
    `${API_BASE_URL}/payments/${paymentId}/razorpay-order`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function verifyRazorpayPayment(
  data: {
    paymentId: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
) {
  const response = await axios.post(
    `${API_BASE_URL}/payments/verify-razorpay`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}