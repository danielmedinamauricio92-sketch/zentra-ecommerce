import { Router } from "express";
import { getProducts, updateProduct } from "../controllers/product.controller";
import checkLogin from "../middlewares/checkLogin.middleware";
import checkAdmin from "../middlewares/checkAdmin.middleware";

const router = Router();

router.get("/", getProducts);
router.patch("/:id", checkLogin, checkAdmin, updateProduct);

export default router;
