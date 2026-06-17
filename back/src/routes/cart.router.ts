import { Router } from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller";
import checkLogin from "../middlewares/checkLogin.middleware";

const cartRouter = Router();

cartRouter.get("/", checkLogin, getCart);
cartRouter.post("/items", checkLogin, addCartItem);
cartRouter.patch("/items/:productId", checkLogin, updateCartItem);
cartRouter.delete("/items/:productId", checkLogin, removeCartItem);
cartRouter.delete("/", checkLogin, clearCart);

export default cartRouter;
