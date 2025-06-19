import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod/v4";
import jwt from "jsonwebtoken";
import prisma from "../../helper/prisma";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const Login = async (req: Request, res: Response) => {
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Invalid login credentials",
      error: z.prettifyError(validationResult.error),
    });
  } else {
    const { username, password } = validationResult.data;

    try {
      const user = await prisma.user.findFirst({
        where: { username },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: "User not found",
          error: "No user exists with the given username.",
        });
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          res.status(400).json({
            success: false,
            message: "Incorrect password",
            error: "Authentication failed due to incorrect password.",
          });
        } else {
          const jwtSecret = process.env.SECRET || "temporarySecret";

          const token = jwt.sign(
            {
              id: user.id,
              name: user.fullname,
              role: user.role,
            },
            jwtSecret,
            {
              header: { alg: "HS256", typ: "JWT" },
            }
          );

          res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            data: {
              ...user,
              token,
            },
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error during authentication",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
};
