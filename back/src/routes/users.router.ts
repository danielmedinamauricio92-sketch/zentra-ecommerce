import { Request, Response, Router } from "express";
import validateUserRegister from "../middlewares/userRegister.middleware";
import validateUserLogin from "../middlewares/userLogin.middleware";
import {
  googleCallback,
  googleLogin,
  login,
  logout,
  me,
  registerUser,
} from "../controllers/user.controller";
import checkLogin from "../middlewares/checkLogin.middleware";
import { OrderRepository } from "../repositories/order.repository";

const usersRouter = Router();

usersRouter.post("/register", validateUserRegister, registerUser);

usersRouter.post("/login", validateUserLogin, login);

usersRouter.post("/logout", logout);

usersRouter.get("/me", checkLogin, me);

usersRouter.get("/google", googleLogin);

usersRouter.get("/google/callback", googleCallback);

usersRouter.get("/orders", checkLogin, async (req: Request, res: Response) => {
  const { userId } = req.body;

  const orders = await OrderRepository.find({
    relations: ["items", "items.product"],
    where: { user: { id: userId } },
  });

  res.send(orders);
});

export default usersRouter;
