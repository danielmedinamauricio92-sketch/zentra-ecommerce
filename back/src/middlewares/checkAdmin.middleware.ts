import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ClientError } from "../utils/errors";

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;

  if (!userId) {
    return next(new ClientError("Authentication is required", 401));
  }

  const user = await UserRepository.findOneBy({ id: userId });

  if (!user) {
    return next(new ClientError("User not found", 404));
  }

  if (user.role !== "admin") {
    return next(new ClientError("Admin access required", 403));
  }

  next();
};

export default checkAdmin;
