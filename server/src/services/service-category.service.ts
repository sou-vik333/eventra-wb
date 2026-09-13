import {
  createServiceCategory,
  deleteServiceCategory,
  findServiceCategoryById,
  findServiceCategoryByName,
  getAllServiceCategories,
  updateServiceCategory,
} from "../repositories/service-category.repository.js";

import type {
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from "../validators/service-category.validator.js";

export async function listServiceCategories() {
  return getAllServiceCategories();
}

export async function getServiceCategory(id: number) {
  const category = await findServiceCategoryById(id);

  if (!category) {
    throw new Error("Service category not found");
  }

  return category;
}

export async function createCategory(
  data: CreateServiceCategoryInput,
) {
  const existingCategory = await findServiceCategoryByName(data.name);

  if (existingCategory) {
    throw new Error("Service category already exists");
  }

  return createServiceCategory({
    name: data.name,
    description: data.description ?? null,
    isActive: true,
  });
}

export async function updateCategory(
  id: number,
  data: UpdateServiceCategoryInput,
) {
  const category = await findServiceCategoryById(id);

  if (!category) {
    throw new Error("Service category not found");
  }

  return updateServiceCategory(id, data);
}

export async function removeCategory(id: number) {
  const category = await findServiceCategoryById(id);

  if (!category) {
    throw new Error("Service category not found");
  }

  return deleteServiceCategory(id);
}