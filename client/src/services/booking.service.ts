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