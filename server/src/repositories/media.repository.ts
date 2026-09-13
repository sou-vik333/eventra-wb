import { db } from "../prisma/db.js";

const Media = db.orm.public.Media;

export async function findMediaById(id: number) {
  return Media.first({
    id,
  });
}

export async function getMediaByVendorId(
  vendorId: number,
) {
  return Media.where({
    vendorId,
  }).all();
}

export async function getActiveMediaByVendorId(
  vendorId: number,
) {
  return Media.where({
    vendorId,
    isActive: true,
  }).all();
}

export async function createMedia(data: {
  vendorId: number;
  title?: string | null;
  description?: string | null;
  url: string;
  publicId?: string | null;
  type: "IMAGE" | "VIDEO" | "REEL";
  isActive?: boolean;
}) {
  return Media.create({
    vendorId: data.vendorId,
    title: data.title ?? null,
    description: data.description ?? null,
    url: data.url,
    publicId: data.publicId ?? null,
    type: data.type,
    isActive: data.isActive ?? true,
  });
}

export async function updateMedia(
  id: number,
  data: {
    title?: string | null;
    description?: string | null;
    url?: string;
    publicId?: string | null;
    type?: "IMAGE" | "VIDEO" | "REEL";
    isActive?: boolean;
  },
) {
  return Media.where({
    id,
  }).update({
    ...(data.title !== undefined && {
      title: data.title,
    }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.url !== undefined && {
      url: data.url,
    }),
    ...(data.publicId !== undefined && {
      publicId: data.publicId,
    }),
    ...(data.type !== undefined && {
      type: data.type,
    }),
    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  });
}

export async function deleteMedia(id: number) {
  return Media.where({
    id,
  }).delete();
}