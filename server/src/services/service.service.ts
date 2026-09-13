import {
  createService,
  deleteService,
  findServiceById,
  getActiveServicesByCategoryId,
  getServicesByVendorId,
  updateService,
} from "../repositories/service.repository.js";

import {
  findVendorByUserId,
} from "../repositories/vendor.repository.js";

import {
  findServiceCategoryById,
} from "../repositories/service-category.repository.js";

import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../validators/service.validator.js";

export async function createVendorService(
  userId: number,
  data: CreateServiceInput,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const category = await findServiceCategoryById(data.categoryId);

  if (!category) {
    throw new Error("Service category not found");
  }

  if (!category.isActive) {
    throw new Error("Service category is inactive");
  }

  return createService({
    vendorId: vendor.id,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description ?? null,
    basePrice: data.basePrice,
    durationMinutes: data.durationMinutes ?? null,
    isActive: true,
  });
}

export async function listVendorServices(userId: number) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return getServicesByVendorId(vendor.id);
}

export async function getService(id: number) {
  const service = await findServiceById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
}

export async function listServicesByCategory(categoryId: number) {
  const category = await findServiceCategoryById(categoryId);

  if (!category) {
    throw new Error("Service category not found");
  }

  return getActiveServicesByCategoryId(categoryId);
}

export async function updateVendorService(
  userId: number,
  serviceId: number,
  data: UpdateServiceInput,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const service = await findServiceById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.vendorId !== vendor.id) {
    throw new Error("You do not have permission to modify this service");
  }

  if (data.categoryId !== undefined) {
    const category = await findServiceCategoryById(data.categoryId);

    if (!category) {
      throw new Error("Service category not found");
    }

    if (!category.isActive) {
      throw new Error("Service category is inactive");
    }
  }

  return updateService(serviceId, data);
}

export async function deleteVendorService(
  userId: number,
  serviceId: number,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const service = await findServiceById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.vendorId !== vendor.id) {
    throw new Error("You do not have permission to delete this service");
  }

  return deleteService(serviceId);
}
