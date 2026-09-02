import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env["JWT_SECRET"] ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

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