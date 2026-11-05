import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found",
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getServiceById(
  serviceId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/services/${serviceId}`,
  );

  return response.data;
}

export async function getServicesByCategory(
  categoryId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/services/category/${categoryId}`,
  );

  return response.data;
}

export async function getMyServices() {
  const response = await axios.get(
    `${API_BASE_URL}/services/me`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export type CreateServiceInput = {
  categoryId: number;
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes?: number;
};

export async function createService(
  data: CreateServiceInput,
) {
  const response = await axios.post(
    `${API_BASE_URL}/services`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export type UpdateServiceInput = {
  categoryId?: number;
  name?: string;
  description?: string;
  basePrice?: number;
  durationMinutes?: number;
  isActive?: boolean;
};

export async function updateService(
  serviceId: number,
  data: UpdateServiceInput,
) {
  const response = await axios.put(
    `${API_BASE_URL}/services/${serviceId}`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteService(
  serviceId: number,
) {
  const response = await axios.delete(
    `${API_BASE_URL}/services/${serviceId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}