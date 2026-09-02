import {
  findUserById,
  findUserByUsername,
  updateUser,
} from "../repositories/user.repository.js";

import type { UpdateProfileInput } from "../validators/user.validator.js";

export async function getUserProfile(userId: number) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUserProfile(
  userId: number,
  data: UpdateProfileInput,
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.username) {
    const existingUser = await findUserByUsername(data.username);

    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username is already in use");
    }
  }

  return updateUser(userId, data);
}