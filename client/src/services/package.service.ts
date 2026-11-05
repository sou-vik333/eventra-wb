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

export type PackageServiceInput = {
  serviceId: number;
  quantity: number;
};

export type CreatePackageInput = {
  name: string;
  description?: string;
  price: number;
  services: PackageServiceInput[];
};

export type UpdatePackageInput = {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  services?: PackageServiceInput[];
};

export async function getMyPackages() {
  const response = await axios.get(
    `${API_BASE_URL}/packages/me`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function getActivePackages() {
  const response = await axios.get(
    `${API_BASE_URL}/packages`,
  );

  return response.data;
}

export async function getPackageById(
  packageId: number,
) {
  const response = await axios.get(
    `${API_BASE_URL}/packages/${packageId}`,
  );

  return response.data;
}

export async function createPackage(
  data: CreatePackageInput,
) {
  const response = await axios.post(
    `${API_BASE_URL}/packages`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function updatePackage(
  packageId: number,
  data: UpdatePackageInput,
) {
  const response = await axios.put(
    `${API_BASE_URL}/packages/${packageId}`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deletePackage(
  packageId: number,
) {
  const response = await axios.delete(
    `${API_BASE_URL}/packages/${packageId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}