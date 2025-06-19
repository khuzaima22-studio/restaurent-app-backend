import { Request, Response } from "express";
import prisma from "../../helper/prisma";
import bcrypt from "bcrypt";

export const InitialData = async (req: Request, res: Response) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      username: "will01",
    },
  });

  if (!existingUser) {
    const defaultUser = {
      fullName: "William",
      username: "will01",
      plainPassword: "12345678",
    };

    const hashedPassword = await bcrypt.hash(defaultUser.plainPassword, 10);

    const predefinedBranches = [
      {
        name: "Toronto, Canada",
        location: "Finch Avenue West,Toronto, Canada",
      },
      {
        name: "Istanbul, Turkey",
        location:
          "İnönü Mah, Kayışdağı Cad, Yeşil Konak, İnönü Mah, Kayışdağı Cad, Yeşil Konak, Istanbul, Turkey",
      },
      {
        name: "Glasgow, United Kingdom",
        location: "Hillcroft Terrace, Bishopbriggs, Glasgow, United Kingdom",
      },
    ];

    try {
      const [createdUser, createdBranches] = await prisma.$transaction([
        prisma.user.create({
          data: {
            fullname: defaultUser.fullName,
            username: defaultUser.username,
            password: hashedPassword,
            role: "manager",
          },
        }),
        prisma.branch.createMany({
          data: predefinedBranches,
        }),
      ]);

      const branchRecords = await prisma.branch.findMany({
        where: {
          name: {
            in: predefinedBranches.map((branch) => branch.name),
          },
        },
      });

      const generatedSales = branchRecords.flatMap((branch) =>
        Array.from({ length: 5 }).map(() => ({
          amount: Math.floor(Math.random() * 1000) + 100,
          branchId: branch.id,
        }))
      );

      const generatedExpenses = branchRecords.flatMap((branch) =>
        Array.from({ length: 5 }).map(() => ({
          description: "Miscellaneous",
          amount: Math.floor(Math.random() * 500) + 50,
          branchId: branch.id,
        }))
      );

      await prisma.$transaction([
        prisma.sale.createMany({ data: generatedSales }),
        prisma.expense.createMany({ data: generatedExpenses }),
      ]);

      res.status(200).json({
        success: true,
        message: "Initial data added successfully.",
        data: {
          user: createdUser,
          branches: createdBranches,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to add initial data.",
        error,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User already exists.",
      data: existingUser,
    });
  }
};
