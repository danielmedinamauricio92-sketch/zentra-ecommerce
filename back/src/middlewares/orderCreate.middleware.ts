import { NextFunction, Request, Response } from "express";
import { ClientError } from "../utils/errors";
import { checkProductExists } from "../services/products.service";

const validateOrderFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, products } = req.body;

  if (!userId || !products || !Array.isArray(products)) {
    return next(new ClientError("Missing fields"));
  }

  if (products.length === 0) {
    return next(new ClientError("Order must have at least one item"));
  }

  for (const item of products) {
    if (
      !item ||
      typeof item.productId !== "number" ||
      typeof item.quantity !== "number"
    ) {
      return next(new ClientError("Invalid product format"));
    }

    if (item.quantity < 1) {
      return next(new ClientError("Quantity must be at least 1"));
    }
  }

  next();
};

const validateItemsExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { products } = req.body;

  for (const item of products) {
    const exists = await checkProductExists(item.productId);

    if (!exists) {
      return next(
        new ClientError("One or more items do not exist in the database")
      );
    }
  }

  next();
};

export default [validateOrderFields, validateItemsExist];