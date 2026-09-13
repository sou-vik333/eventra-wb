import { db } from "../prisma/db.js";

import { Temporal } from "@js-temporal/polyfill";

import type { VendorDiscoveryQuery } from "../validators/vendor-discovery.validator.js";

const Vendor = db.orm.public.Vendor;
const Service = db.orm.public.Service;
const VendorLocation = db.orm.public.VendorLocation;
const Location = db.orm.public.Location;

export async function getActiveVendors() {
  return Vendor.where({
    status: "ACTIVE",
    isVerified: true,
  }).all();
}

export async function getActiveVendorsByCategory(
  categoryId: number,
) {
  const vendors = await Vendor.where({
    status: "ACTIVE",
    isVerified: true,
  }).all();

  const results = [];

  for (const vendor of vendors) {
    const services = await Service.where({
      vendorId: vendor.id,
      categoryId,
      isActive: true,
    }).all();

    if (services.length > 0) {
      results.push(vendor);
    }
  }

  return results;
}

export async function searchActiveVendors(
  query: VendorDiscoveryQuery,
) {
  let vendors = await Vendor.where({
    status: "ACTIVE",
    isVerified: true,
  }).all();

  // Category filter
  if (query.categoryId !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const services = await Service.where({
        vendorId: vendor.id,
        categoryId: query.categoryId,
        isActive: true,
      }).all();

      if (services.length > 0) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // District filter
  if (query.district !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const vendorLocations = await VendorLocation.where({
        vendorId: vendor.id,
      }).all();

      let districtMatches = false;

      for (const vendorLocation of vendorLocations) {
        const location = await Location.first({
          id: vendorLocation.locationId,
        });

        if (
          location &&
          location.district.toLowerCase() ===
            query.district.toLowerCase()
        ) {
          districtMatches = true;
          break;
        }
      }

      if (districtMatches) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // City filter
  if (query.city !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const vendorLocations = await VendorLocation.where({
        vendorId: vendor.id,
      }).all();

      let cityMatches = false;

      for (const vendorLocation of vendorLocations) {
        const location = await Location.first({
          id: vendorLocation.locationId,
        });

        if (
          location &&
          location.city &&
          location.city.toLowerCase() ===
            query.city.toLowerCase()
        ) {
          cityMatches = true;
          break;
        }
      }

      if (cityMatches) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // Area filter
  if (query.area !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const vendorLocations = await VendorLocation.where({
        vendorId: vendor.id,
      }).all();

      let areaMatches = false;

      for (const vendorLocation of vendorLocations) {
        const location = await Location.first({
          id: vendorLocation.locationId,
        });

        if (
          location &&
          location.area &&
          location.area.toLowerCase() ===
            query.area.toLowerCase()
        ) {
          areaMatches = true;
          break;
        }
      }

      if (areaMatches) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // Pincode filter
  if (query.pincode !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const vendorLocations = await VendorLocation.where({
        vendorId: vendor.id,
      }).all();

      let pincodeMatches = false;

      for (const vendorLocation of vendorLocations) {
        const location = await Location.first({
          id: vendorLocation.locationId,
        });

        if (
          location &&
          location.pincode === query.pincode
        ) {
          pincodeMatches = true;
          break;
        }
      }

      if (pincodeMatches) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // Minimum price filter
  if (query.minPrice !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const services = await Service.where({
        vendorId: vendor.id,
        isActive: true,
      }).all();

      let priceMatches = false;

      for (const service of services) {
        const basePrice = Number(service.basePrice);

        if (basePrice >= query.minPrice) {
          priceMatches = true;
          break;
        }
      }

      if (priceMatches) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // Maximum price filter
  if (query.maxPrice !== undefined) {
    const matchingVendors = [];

    for (const vendor of vendors) {
      const services = await Service.where({
        vendorId: vendor.id,
        isActive: true,
      }).all();

      let priceMatches = false;

      for (const service of services) {
        const basePrice = Number(service.basePrice);

        if (basePrice <= query.maxPrice) {
          priceMatches = true;
          break;
        }
      }

      if (priceMatches) {
        matchingVendors.push(vendor);
      }
    }

    vendors = matchingVendors;
  }

  // Sorting
  if (query.sort === "newest") {
    vendors.sort((a, b) =>
      Temporal.Instant.compare(
        b.createdAt,
        a.createdAt,
      ),
    );
  }

  if (
    query.sort === "price_low" ||
    query.sort === "price_high"
  ) {
    const vendorPrices = new Map<number, number>();

    for (const vendor of vendors) {
      const services = await Service.where({
        vendorId: vendor.id,
        isActive: true,
      }).all();

      if (services.length === 0) {
        continue;
      }

      const prices = services.map((service) =>
        Number(service.basePrice),
      );

      const lowestPrice = Math.min(...prices);

      vendorPrices.set(vendor.id, lowestPrice);
    }

    vendors.sort((a, b) => {
      const priceA = vendorPrices.get(a.id) ?? 0;
      const priceB = vendorPrices.get(b.id) ?? 0;

      if (query.sort === "price_low") {
        return priceA - priceB;
      }

      return priceB - priceA;
    });
  }

  // Total results before pagination
  const total = vendors.length;

  // Pagination
  const startIndex =
    (query.page - 1) * query.limit;

  const endIndex =
    startIndex + query.limit;

  const paginatedVendors = vendors.slice(
    startIndex,
    endIndex,
  );

  const totalPages =
    total === 0
      ? 0
      : Math.ceil(total / query.limit);

  return {
    vendors: paginatedVendors,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
}

export async function getPublicVendorById(
  vendorId: number,
) {
  return Vendor.first({
    id: vendorId,
    status: "ACTIVE",
    isVerified: true,
  });
}
export async function getActiveServicesByVendorId(
  vendorId: number,
) {
  return Service.where({
    vendorId,
    isActive: true,
  }).all();
}
export async function getVendorLocationsByVendorId(
  vendorId: number,
) {
  return VendorLocation.where({
    vendorId,
  }).all();
}