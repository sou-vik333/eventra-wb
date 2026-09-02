import type { Request, Response } from "express";

import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";
import {
  loginUser,
  registerUser,
} from "../services/auth.service.js";
export async function register(
  req: Request,
  res: Response,
) {
  try {
    const input = registerSchema.parse(req.body);

    const result = await registerUser(input);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function login(
  req: Request,
  res: Response,
) {
  try {
    const input = loginSchema.parse(req.body);

    const result = await loginUser(input);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export function getMe(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      userId: req.user.userId,
      role: req.user.role,
    },
  });
}