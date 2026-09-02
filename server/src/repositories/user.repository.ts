import { db } from "../prisma/db";

const User = db.orm.public.User;

export async function findUserByEmail(email: string) {
  return User.first({
    email,
  });
}
export async function findUserByUsername(username: string) {
  return User.first({
    username,
  });
}
export async function findUserById(id: number) {
  return User.first({
    id,
  });
}

export async function getAllUsers() {
  return User.all();
}

export async function createUser(data: {
  email: string;
  username?: string | null;
  name?: string | null;
  passwordHash: string;
  phone?: string | null;
  role?: "CUSTOMER" | "VENDOR" | "ADMIN";
  isActive?: boolean;
}) {
  return User.create(data);
}

export async function updateUser(
  id: number,
  data: {
    username?: string | null;
    name?: string | null;
    phone?: string | null;
  },
) {
  return User.where({ id }).update(data);
}

export async function deleteUser(id: number) {
  return User.where({ id }).delete();
}