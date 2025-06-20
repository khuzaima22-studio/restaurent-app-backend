import { Request, Response } from "express";
import prisma from "../../helper/prisma";
import z from "zod/v4";

const changeOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.string().min(1),
});

export const ChangeOrderStatus = async (req: Request, res: Response) => {
  const validation = changeOrderStatusSchema.safeParse(req.body);

  if (validation.success) {
    const { orderId, status } = req.body;

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message || error,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid status update data",
      error: z.prettifyError(validation.error),
    });
  }
};
