import { Request, Response } from "express";
import { createOrderService } from "../services/order.service";
import { catchedController } from "../utils/catchedController";

export const createOrder = catchedController(
  async (req: Request, res: Response) => {
    const {
      userId,
      products,
      shippingMethod,
      customerName,
      customerEmail,
      shippingAddress,
      recipientName,
    } = req.body;

    const newOrder = await createOrderService({
      userId,
      products,
      shippingMethod,
      customerName,
      customerEmail,
      shippingAddress,
      recipientName,
    });

    res.send(newOrder);
  }
);
