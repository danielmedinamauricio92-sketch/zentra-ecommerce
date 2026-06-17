import { Request, Response } from "express";
import { catchedController } from "../utils/catchedController";
import {
  getGoogleAuthUrlService,
  getGoogleErrorRedirect,
  getGoogleSuccessRedirect,
  getUserByIdService,
  loginWithGoogleService,
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie";

export const registerUser = catchedController(
  async (req: Request, res: Response) => {
    const { email, password, name, address, phone } = req.body;
    const newUser = await registerUserService({
      email,
      password,
      name,
      address,
      phone,
    });
    res.status(201).send(newUser);
  }
);

export const login = catchedController(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await loginUserService({ email, password });
  setAuthCookie(res, user.token);

  res.status(200).send({
    login: true,
    user: user.user,
  });
});

export const me = catchedController(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = await getUserByIdService(userId);

  res.status(200).send({ user });
});

export const logout = catchedController(async (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(200).send({ logout: true });
});

export const googleLogin = catchedController(
  async (req: Request, res: Response) => {
    res.redirect(getGoogleAuthUrlService());
  }
);

export const googleCallback = catchedController(
  async (req: Request, res: Response) => {
    const code = String(req.query.code || "");

    if (!code) {
      return res.redirect(getGoogleErrorRedirect());
    }

    try {
      const session = await loginWithGoogleService(code);
      setAuthCookie(res, session.token);
      return res.redirect(getGoogleSuccessRedirect());
    } catch (error) {
      return res.redirect(getGoogleErrorRedirect());
    }
  }
);
