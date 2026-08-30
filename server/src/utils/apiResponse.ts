import { Response } from "express";

export function sendSuccess(
  res: Response,
  message: string,
  data: unknown = null,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  code = "INTERNAL_SERVER_ERROR",
  statusCode = 500
) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}