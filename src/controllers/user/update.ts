import { Request, Response } from "express";
import { z } from "zod/v4";
import bcrypt from "bcrypt";
import prisma from "../../helper/prisma";

const userUpdateSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  userName: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  branchId: z.uuid().optional(),
  role: z.string().min(1, "Role is required"),
});

export const UpdateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validation = userUpdateSchema.safeParse(req.body);

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
    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
      return;
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : existingUser.password;

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        fullname,
        username: userName,
        password: hashedPassword,
        role,
        branchId: role === "supervisor" ? null : branchId || null,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message || error,
    });
  }
};
