import {
  createVendor,
  findVendorById,
  findVendorByUserId,
  updateVendor,
} from "../repositories/vendor.repository.js";

import type {
  CreateVendorInput,
} from "../validators/vendor.validator.js";

export async function createVendorProfile(
  userId: number,
  data: CreateVendorInput,
) {
  const existingVendor = await findVendorByUserId(userId);

  if (existingVendor) {
    throw new Error("Vendor profile already exists");
  }

  return createVendor({
    userId,
    businessName: data.businessName,
    description: data.description,
    phone: data.phone,
    email: data.email,
  });
}

export async function getVendorProfile(userId: number) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return vendor;
}
export async function getVendorById(
  vendorId: number,
) {
  const vendor = await findVendorById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return vendor;
}

export async function updateVendorProfile(
  userId: number,
  data: {
    businessName?: string;
    description?: string;
    phone?: string;
    email?: string;
  },
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return updateVendor(vendor.id, data);
}