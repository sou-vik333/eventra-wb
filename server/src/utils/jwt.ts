import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env["JWT_SECRET"];

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

const JWT_SECRET: string = jwtSecret;

export type JwtPayload = {
  userId: number;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
};

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid JWT payload");
  }

  return decoded as unknown as JwtPayload;
}