import { NextFunction, Request, Response } from "express";
import { ClientError } from "../utils/errors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";
import { AUTH_COOKIE_NAME, getCookieValue } from "../utils/authCookie";

const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
  const token =
    getCookieValue(req.headers.cookie, AUTH_COOKIE_NAME) ||
    req.headers.authorization;

  if (!token) {
    return next(new ClientError("Token is required"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.body.userId = decoded.userId;
  } catch (error) {
    return next(new ClientError("Invalid token", 401));
  }

  next();
};

export default checkLogin;
