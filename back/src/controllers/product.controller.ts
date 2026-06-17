import { Request, Response } from "express";
import { catchedController } from "../utils/catchedController";
import {
  getProductsService,
  updateProductService,
} from "../services/products.service";

export const getProducts = catchedController(
  async (req: Request, res: Response) => {
    const products = await getProductsService();
    res.json(products);
  }
);

export const updateProduct = catchedController(
  async (req: Request, res: Response) => {
    const productId = Number(req.params.id);
    const product = await updateProductService(productId, req.body);

    res.status(200).json(product);
  }
);
