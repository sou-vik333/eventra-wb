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

export async function getEventTasks(
  eventId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/event-tasks/event/${eventId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function createEventTask(data: {
  eventId: number;
  title: string;
  description?: string;
  dueDate?: string;
}) {
  const response = await axios.post(
    `${API_BASE_URL}/event-tasks/event/${data.eventId}`,
    {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function updateEventTask(
  taskId: number,
  data: {
    title?: string;
    description?: string;
    dueDate?: string | null;
    status?: "TODO" | "IN_PROGRESS" | "COMPLETED";
  },
) {
  const response = await axios.put(
    `${API_BASE_URL}/event-tasks/${taskId}`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteEventTask(
  taskId: number,
) {
  const response = await axios.delete(
    `${API_BASE_URL}/event-tasks/${taskId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}