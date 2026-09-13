import { db } from "../prisma/db.js";

const Service = db.orm.public.Service;

export async function findServiceById(id: number) {
  return Service.first({ id });
}

export async function getServicesByVendorId(vendorId: number) {
  return Service.where({ vendorId }).all();
}

export async function getActiveServicesByCategoryId(categoryId: number) {
  return Service.where({
    categoryId,
    isActive: true,
  }).all();
}

export async function createService(data: {
  vendorId: number;
  categoryId: number;
  name: string;
  description?: string | null;
  basePrice: number;
  durationMinutes?: number | null;
  isActive?: boolean;
}) {
  return Service.create({
    vendorId: data.vendorId,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description ?? null,
    basePrice: data.basePrice.toString(),
    durationMinutes: data.durationMinutes ?? null,
    isActive: data.isActive ?? true,
  });
}

export async function updateService(
  id: number,
  data: {
    categoryId?: number;
    name?: string;
    description?: string | null;
    basePrice?: number;
    durationMinutes?: number | null;
    isActive?: boolean;
  },
) {
  return Service.where({ id }).update({
    ...(data.categoryId !== undefined && {
      categoryId: data.categoryId,
    }),
    ...(data.name !== undefined && {
      name: data.name,
    }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.basePrice !== undefined && {
      basePrice: data.basePrice.toString(),
    }),
    ...(data.durationMinutes !== undefined && {
      durationMinutes: data.durationMinutes,
    }),
    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  });
}

export async function deleteService(id: number) {
  return Service.where({ id }).delete();
}