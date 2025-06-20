import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const IsToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.SECRET || "temporarySecret";

    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token.",
          error: error.message,
        });
      }
      next();
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Authorization token not provided.",
      error: "Missing Bearer token in Authorization header.",
    });
  }
};
