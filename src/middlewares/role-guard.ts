import { NextFunction, Request, Response } from "express";
import prisma from "../helper/prisma";
import jwt from "jsonwebtoken";

export const RoleGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.SECRET || "temporarySecret";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization token is missing or invalid",
      error: "No Bearer token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  let userId: string;

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
    };
    userId = decoded.id;
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (user?.role === "manager" || user?.role === "admin") {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Access denied: manager or admin role required",
        error: "Insufficient permissions",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to validate user role",
      error: err.message,
    });
  }
};
