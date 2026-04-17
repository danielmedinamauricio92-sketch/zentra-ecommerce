import { Request, Response } from "express";
import { createOrderService } from "../services/order.service";
import { catchedController } from "../utils/catchedController";

export const createOrder = catchedController(
  async (req: Request, res: Response) => {
    const {
      userId,
      products,
      subtotal,
      shippingMethod,
      shippingCost,
      discount,
      total,
    } = req.body;

    const newOrder = await createOrderService({
      userId,
      products,
      subtotal,
      shippingMethod,
      shippingCost,
      discount,
      total,
    });

    res.send(newOrder);
  }
);