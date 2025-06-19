import { Request, Response } from "express";
import { z } from "zod/v4";
import prisma from "../../helper/prisma";
import bcrypt from "bcrypt";

const userSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  branchId: z.string().uuid().optional(),
  role: z.string().min(1, "Role is required"),
});

export const CreateUser = async (req: Request, res: Response) => {
  const validation = userSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
      error: z.prettifyError(validation.error),
    });
    return;
  }

  const { fullname, userName, password, branchId, role } = validation.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { username: userName },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Username already exists",
        error: "A user with this username already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        username: userName,
        password: hashedPassword,
        role,
        branchId: branchId || null,
      },
    });

    res.status(200).json({
      success: true,
      message: "User added successfully",
      data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message || error,
    });
  }
};
