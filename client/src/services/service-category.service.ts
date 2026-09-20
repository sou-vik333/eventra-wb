import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

export async function getServiceCategories() {
  const response = await axios.get(
    `${API_BASE_URL}/service-categories`,
  );

  return response.data;
}

export async function getServiceCategory(
  categoryId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/service-categories/${categoryId}`,
  );

  return response.data;
}