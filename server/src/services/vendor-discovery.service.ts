import {
  getActiveServicesByVendorId,
  getActiveVendors,
  getActiveVendorsByCategory,
  getPublicVendorById,
  getVendorLocationsByVendorId,
  searchActiveVendors,
} from "../repositories/vendor-discovery.repository.js";

import {
  getActiveMediaByVendorId,
} from "../repositories/media.repository.js";
import {
  findServiceCategoryById,
} from "../repositories/service-category.repository.js";

import {
  findLocationById,
} from "../repositories/location.repository.js";

import type { VendorDiscoveryQuery } from "../validators/vendor-discovery.validator.js";

export async function listActiveVendors() {
  return getActiveVendors();
}

export async function listActiveVendorsByCategory(
  categoryId: number,
) {
  return getActiveVendorsByCategory(categoryId);
}

export async function searchVendors(
  query: VendorDiscoveryQuery,
) {
  return searchActiveVendors(query);
}

export async function getPublicVendorDetails(
  vendorId: number,
) {
  const vendor = await getPublicVendorById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  // Get active services
  const services = await getActiveServicesByVendorId(
    vendor.id,
  );

  // Add category information to each service
  const servicesWithCategories = await Promise.all(
    services.map(async (service) => {
      const category = await findServiceCategoryById(
        service.categoryId,
      );

      return {
        ...service,
        category,
      };
    }),
  );

  // Get vendor locations
  const vendorLocations =
    await getVendorLocationsByVendorId(vendor.id);

  // Get complete location information
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

  // Get active portfolio media
  const media = await getActiveMediaByVendorId(
    vendor.id,
  );

  return {
    vendor,
    services: servicesWithCategories,
    locations,
    media,
  };
}