import { Request, Response } from "express";
import prisma from "../../helper/prisma";

export const FetchOrders = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = id ? await prisma.user.findFirst({ where: { id: id } }) : null;
    let chefData = null;
    let waiterData = null;

    if (user?.role === "chef") {
      chefData = await prisma.order.findMany({
        where: {
          status: "pending",
          branchId: user.branchId || "",
        },
        include: {
          waiter: {
            select: {
              fullname: true,
            },
          },
        },
      });
    } else {
      waiterData = await prisma.order.findMany({
        where: {
          branchId: user?.branchId || "",
        },
        include: {
          waiter: {
            select: {
              fullname: true,
            },
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: user?.role === "chef" ? chefData : waiterData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch Orders",
      error,
    });
  }
};
