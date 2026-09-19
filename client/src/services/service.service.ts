import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

export async function getServiceById(
  serviceId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/services/${serviceId}`,
  );

  return response.data;
}