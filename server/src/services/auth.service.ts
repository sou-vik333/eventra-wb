import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository";

import {
  generateToken,
  type JwtPayload,
} from "../utils/jwt";

import type {
  LoginInput,
  RegisterInput,
} from "../validators/auth.validator";

export async function registerUser(input: RegisterInput) {
  // Check whether email is already registered
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, 12);

  // Create user
  const user = await createUser({
    email: input.email,
    username: input.username ?? null,
    name: input.name ?? null,
    passwordHash,
    phone: input.phone ?? null,
    role: input.role ?? "CUSTOMER",
    isActive: true,
  });

  // Generate JWT
  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = generateToken(payload);

  // Never return passwordHash
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    },
    token,
  };
}

export async function loginUser(input: LoginInput) {
  // Find user
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check account status
  if (!user.isActive) {
    throw new Error("Account is inactive");
  }

  // Compare password
  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = generateToken(payload);

  // Never return passwordHash
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    },
    token,
  };
}