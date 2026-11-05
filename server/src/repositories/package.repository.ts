
import { db } from "../prisma/db.js";

const Package = db.orm.public.Package;
const PackageService = db.orm.public.PackageService;

export async function findPackageById(id: number) {
  return Package.first({ id });
}

export async function findActivePackageById(id: number) {
  return Package.first({
    id,
    isActive: true,
  });
}

export async function getPackagesByVendorId(
  vendorId: number,
) {
  return Package.where({ vendorId }).all();
}

export async function getActivePackages() {
  return Package.where({
    isActive: true,
  }).all();
}

export async function getActivePackagesByVendorId(
  vendorId: number,
) {
  return Package.where({
    vendorId,
    isActive: true,
  }).all();
}

export async function createPackage(data: {
  vendorId: number;
  name: string;
  description?: string | null;
  price: number;
  isActive?: boolean;
}) {
  return Package.create({
    vendorId: data.vendorId,
    name: data.name,
    description: data.description ?? null,
    price: data.price.toString(),
    isActive: data.isActive ?? true,
  });
}

export async function updatePackage(
  id: number,
  data: {
    name?: string;
    description?: string | null;
    price?: number;
    isActive?: boolean;
  },
) {
  return Package.where({ id }).update({
    ...(data.name !== undefined && {
      name: data.name,
    }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.price !== undefined && {
      price: data.price.toString(),
    }),
    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  });
}

export async function deletePackage(id: number) {
  await PackageService.where({
    packageId: id,
  }).delete();

  return Package.where({ id }).delete();
}

export async function getPackageServices(
  packageId: number,
) {
  return PackageService.where({
    packageId,
  }).all();
}

export async function addServiceToPackage(data: {
  packageId: number;
  serviceId: number;
  quantity: number;
}) {
  return PackageService.create({
    packageId: data.packageId,
    serviceId: data.serviceId,
    quantity: data.quantity,
  });
}

export async function removeServiceFromPackage(
  packageId: number,
  serviceId: number,
) {
  return PackageService.where({
    packageId,
    serviceId,
  }).delete();
}
