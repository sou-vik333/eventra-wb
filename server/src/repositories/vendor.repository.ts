import { db } from "../prisma/db.js";

const Vendor = db.orm.public.Vendor;

export async function findVendorByUserId(userId: number) {
  return Vendor.first({
    userId,
  });
}

export async function findVendorById(id: number) {
  return Vendor.first({
    id,
  });
}

export async function getAllVendors() {
  return Vendor.all();
}

export async function createVendor(data: {
  userId: number;
  businessName: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
}) {
  return Vendor.create(data);
}

export async function updateVendor(
  id: number,
  data: {
    businessName?: string;
    description?: string | null;
    phone?: string | null;
    email?: string | null;
  },
) {
  return Vendor.where({ id }).update(data);
}