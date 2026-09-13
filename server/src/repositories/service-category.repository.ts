import { db } from "../prisma/db.js";

const ServiceCategory = db.orm.public.ServiceCategory;

export async function getAllServiceCategories() {
  return ServiceCategory.all();
}

export async function findServiceCategoryById(id: number) {
  return ServiceCategory.first({ id });
}

export async function findServiceCategoryByName(name: string) {
  return ServiceCategory.first({ name });
}

export async function createServiceCategory(data: {
  name: string;
  description?: string | null;
  isActive?: boolean;
}) {
  return ServiceCategory.create(data);
}

export async function updateServiceCategory(
  id: number,
  data: {
    name?: string;
    description?: string | null;
    isActive?: boolean;
  },
) {
  return ServiceCategory.where({ id }).update(data);
}

export async function deleteServiceCategory(id: number) {
  return ServiceCategory.where({ id }).delete();
}