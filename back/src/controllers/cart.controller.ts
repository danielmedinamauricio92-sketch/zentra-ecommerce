import { Request, Response } from "express";
import {
  addCartItemService,
  clearCartService,
  getCartService,
  removeCartItemService,
  updateCartItemService,
} from "../services/cart.service";
import { catchedController } from "../utils/catchedController";

export const getCart = catchedController(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const cart = await getCartService(userId);

  res.status(200).send(cart);
});

export const addCartItem = catchedController(
  async (req: Request, res: Response) => {
    const { userId, productId } = req.body;
    const cart = await addCartItemService(userId, Number(productId));

    res.status(200).send(cart);
  }
);

export const updateCartItem = catchedController(
  async (req: Request, res: Response) => {
    const { userId, quantity } = req.body;
    const productId = Number(req.params.productId);
    const cart = await updateCartItemService(userId, productId, quantity);

    res.status(200).send(cart);
  }
);

export const removeCartItem = catchedController(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const productId = Number(req.params.productId);
    const cart = await removeCartItemService(userId, productId);

    res.status(200).send(cart);
  }
);

export const clearCart = catchedController(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const cart = await clearCartService(userId);

    res.status(200).send(cart);
  }
);
