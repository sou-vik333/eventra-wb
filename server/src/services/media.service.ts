import {
  createMedia,
  deleteMedia,
  findMediaById,
  getMediaByVendorId,
  updateMedia,
} from "../repositories/media.repository.js";

import {
  findVendorByUserId,
} from "../repositories/vendor.repository.js";

import type {
  CreateMediaInput,
  UpdateMediaInput,
} from "../validators/media.validator.js";

export async function createVendorMedia(
  userId: number,
  data: CreateMediaInput,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return createMedia({
    vendorId: vendor.id,
    title: data.title ?? null,
    description: data.description ?? null,
    url: data.url,
    publicId: data.publicId ?? null,
    type: data.type,
    isActive: true,
  });
}

export async function listVendorMedia(
  userId: number,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return getMediaByVendorId(vendor.id);
}

export async function updateVendorMedia(
  userId: number,
  mediaId: number,
  data: UpdateMediaInput,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const media = await findMediaById(mediaId);

  if (!media) {
    throw new Error("Media not found");
  }

  if (media.vendorId !== vendor.id) {
    throw new Error(
      "You do not have permission to modify this media",
    );
  }

  return updateMedia(mediaId, data);
}

export async function deleteVendorMedia(
  userId: number,
  mediaId: number,
) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const media = await findMediaById(mediaId);

  if (!media) {
    throw new Error("Media not found");
  }

  if (media.vendorId !== vendor.id) {
    throw new Error(
      "You do not have permission to delete this media",
    );
  }

  await deleteMedia(mediaId);
}