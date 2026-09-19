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

export async function getMyEvents() {
  const response = await axios.get(
    `${API_BASE_URL}/events`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function getEventById(
  eventId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/events/${eventId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function createEvent(data: {
  name: string;
  type: string;
  description?: string;
  eventDate?: string;
  guestCount?: number;
  budget?: number;
  budgetNotes?: string;
  locationId?: number;
}) {
  const response = await axios.post(
    `${API_BASE_URL}/events`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function updateEvent(
  eventId: number,
  data: {
    name?: string;
    type?: string;
    description?: string;
    eventDate?: string;
    guestCount?: number;
    budget?: number;
    budgetNotes?: string;
    locationId?: number | null;
  },
) {
  const response = await axios.put(
    `${API_BASE_URL}/events/${eventId}`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteEvent(
  eventId: number,
) {
  const response = await axios.delete(
    `${API_BASE_URL}/events/${eventId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}