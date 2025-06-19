import { Request, Response } from "express";
import prisma from "../../helper/prisma";

export const FetchBranch = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = id ? await prisma.user.findFirst({ where: { id: id } }) : null;
    let branchData = null;
    let chefOrders = null;

    if (user?.role === "chef") {
       chefOrders = [
        {
          orderId: "ORD-2001",
          tableNumber: 4,
          customerName: "Michael Reeves",
          waiterName: "Olivia Parker",
          items: [
            { itemName: "Lemon Herb Chicken", quantity: 2 },
            { itemName: "Greek Salad", quantity: 1 },
          ],
          status: "pending",
          placedAt: new Date(
            Date.now() - Math.floor(Math.random() * 3600 * 1000)
          ).toISOString(),
          specialInstructions: "Serve salad without olives",
        },
        {
          orderId: "ORD-2002",
          tableNumber: 2,
          customerName: "Emily Turner",
          waiterName: "Ethan Brooks",
          items: [
            { itemName: "Four Cheese Pizza", quantity: 1 },
            { itemName: "Stuffed Garlic Knots", quantity: 2 },
          ],
          status: "preparing",
          placedAt: new Date(
            Date.now() - Math.floor(Math.random() * 3600 * 1000)
          ).toISOString(),
          specialInstructions: "Extra crispy garlic knots",
        },
        {
          orderId: "ORD-2003",
          tableNumber: 6,
          customerName: "Omar Siddiqui",
          waiterName: "Chloe Bennett",
          items: [
            { itemName: "Ribeye Steak", quantity: 1 },
            { itemName: "Roasted Vegetables", quantity: 1 },
          ],
          status: "ready",
          placedAt: new Date(
            Date.now() - Math.floor(Math.random() * 3600 * 1000)
          ).toISOString(),
          specialInstructions: "Steak should be medium-well",
        },
        {
          orderId: "ORD-2004",
          tableNumber: 5,
          customerName: "Hannah Kim",
          waiterName: "Lucas Johnson",
          items: [
            { itemName: "Spicy Tuna Roll", quantity: 2 },
            { itemName: "Miso Soup", quantity: 1 },
          ],
          status: "pending",
          placedAt: new Date(
            Date.now() - Math.floor(Math.random() * 3600 * 1000)
          ).toISOString(),
          specialInstructions: "Less wasabi in the rolls",
        },
        {
          orderId: "ORD-2005",
          tableNumber: 1,
          customerName: "David Chen",
          waiterName: "Emma Lewis",
          items: [
            { itemName: "Pad Thai", quantity: 1 },
            { itemName: "Thai Iced Tea", quantity: 1 },
          ],
          status: "preparing",
          placedAt: new Date(
            Date.now() - Math.floor(Math.random() * 3600 * 1000)
          ).toISOString(),
          specialInstructions: "No peanuts on the Pad Thai",
        },
        {
          orderId: "ORD-2006",
          tableNumber: 3,
          customerName: "Laura Bennett",
          waiterName: "Jack Thompson",
          items: [
            { itemName: "Margherita Pizza", quantity: 1 },
            { itemName: "Caesar Salad", quantity: 1 },
          ],
          status: "ready",
          placedAt: new Date(
            Date.now() - Math.floor(Math.random() * 3600 * 1000)
          ).toISOString(),
          specialInstructions: "Extra parmesan on the salad",
        },
      ];
      
    } else {
      branchData = await prisma.branch.findMany({
        where: id ? { users: { some: { id: id } } } : undefined,
        include: {
          expenses: { select: { amount: true } },
          sales: { select: { amount: true } },
        },
      });

      branchData = branchData.map((branch) => {
        const totalExpense = branch.expenses.reduce(
          (sum, e) => sum + e.amount,
          0
        );
        const totalSale = branch.sales.reduce((sum, s) => sum + s.amount, 0);

        return {
          id: branch.id,
          name: branch.name,
          location: branch.location,
          totalExpense,
          totalSale,
        };
      });
    }

    res.status(200).json({
      success: true,
      message: "Branches fetched successfully",
      data: user?.role === "chef" ? chefOrders : branchData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch branches",
      error,
    });
  }
};
