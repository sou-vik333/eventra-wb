import { db } from "../prisma/db.js";

const VendorLocation = db.orm.public.VendorLocation;

export async function findVendorLocation(
  vendorId: number,
  locationId: number,
) {
  return VendorLocation.first({
    vendorId,
    locationId,
  });
}

export async function getVendorLocationsByVendorId(
  vendorId: number,
) {
  return VendorLocation.where({ vendorId }).all();
}

export async function createVendorLocation(data: {
  vendorId: number;
  locationId: number;
}) {
  return VendorLocation.create({
    vendorId: data.vendorId,
    locationId: data.locationId,
  });
}

export async function deleteVendorLocation(
  vendorId: number,
  locationId: number,
) {
  return VendorLocation.where({
    vendorId,
    locationId,
  }).delete();
}