import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../types/auth-payload";
import User from "../models/User";
// Middleware kiểm tra tài khoản đã active chưa
export const ActivedAccountMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as AuthPayload;
  const findUser = await User.findById(user.id);
  if (findUser?.isActive) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message:
        "Tài khoản chưa kích hoạt (vui lòng kiểm tra email để kích hoạt)",
    });
  }
};
