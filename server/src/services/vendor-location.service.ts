import {
  createVendorLocation,
  deleteVendorLocation,
  findVendorLocation,
  getVendorLocationsByVendorId,
} from "../repositories/vendor-location.repository.js";

import {
  createLocation,
  findLocation,
  findLocationById,
} from "../repositories/location.repository.js";

import {
  findVendorByUserId,
} from "../repositories/vendor.repository.js";

import type {
  CreateVendorLocationInput,
} from "../validators/vendor-location.validator.js";

export async function createVendorLocationProfile(
  userId: number,
  data: CreateVendorLocationInput,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  let location = await findLocation({
    district: data.district,
    city: data.city ?? null,
    area: data.area ?? null,
    pincode: data.pincode ?? null,
  });

  if (!location) {
    location = await createLocation({
      district: data.district,
      city: data.city ?? null,
      area: data.area ?? null,
      pincode: data.pincode ?? null,
    });
  }

  const existingVendorLocation = await findVendorLocation(
    vendor.id,
    location.id,
  );

  if (existingVendorLocation) {
    throw new Error("This location is already added to your vendor profile");
  }

  return createVendorLocation({
    vendorId: vendor.id,
    locationId: location.id,
  });
}

export async function listVendorLocations(userId: number) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const vendorLocations = await getVendorLocationsByVendorId(vendor.id);

  const locations = await Promise.all(
    vendorLocations.map(async (vendorLocation) => {
      const location = await findLocationById(
        vendorLocation.locationId,
      );

      return {
        locationId: vendorLocation.locationId,
        location,
      };
    }),
  );

  return locations;
}

export async function deleteVendorLocationProfile(
  userId: number,
  locationId: number,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const vendorLocation = await findVendorLocation(
    vendor.id,
    locationId,
  );

  if (!vendorLocation) {
    throw new Error("Vendor location not found");
  }

  await deleteVendorLocation(
    vendor.id,
    locationId,
  );
}