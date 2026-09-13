import { db } from "../prisma/db.js";

const Location = db.orm.public.Location;

export async function findLocationById(id: number) {
  return Location.first({ id });
}

export async function findLocation(data: {
  district: string;
  city?: string | null;
  area?: string | null;
  pincode?: string | null;
}) {
  return Location.first({
    district: data.district,
    city: data.city ?? null,
    area: data.area ?? null,
    pincode: data.pincode ?? null,
  });
}

export async function createLocation(data: {
  district: string;
  city?: string | null;
  area?: string | null;
  pincode?: string | null;
  state?: string;
}) {
  return Location.create({
    district: data.district,
    city: data.city ?? null,
    area: data.area ?? null,
    pincode: data.pincode ?? null,
    state: data.state ?? "West Bengal",
  });
}