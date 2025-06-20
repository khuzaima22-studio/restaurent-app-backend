import { Request, Response } from "express";
import prisma from "../../helper/prisma";
import z from "zod/v4";

const createOrderSchema = z.object({
  tableNumber: z.number().int(),
  customerName: z.string().min(1),
  waiterId: z.uuid(),
  branchId: z.uuid(),
  status: z.string().min(1),
  placedAt: z.iso.datetime(),
  specialInstructions: z.string().optional(),
  items: z.array(
    z.object({
      itemName: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
});
export const CreateOrder = async (req: Request, res: Response) => {
  const validation = createOrderSchema.safeParse(req.body);
  if (validation.success) {
    const {
      tableNumber,
      customerName,
      waiterId,
      branchId,
      status,
      placedAt,
      specialInstructions,
      items,
    } = req.body;
    try {
      const newOrder = await prisma.order.create({
        data: {
          tableNumber,
          customerName,
          waiterId,
          branchId,
          status,
          placedAt,
          specialInstructions,
          items,
        },
      });

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: newOrder,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message || error,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid order data",
      error: z.prettifyError(validation.error),
    });
  }
};
