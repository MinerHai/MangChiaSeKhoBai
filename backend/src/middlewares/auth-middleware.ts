import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AuthPayload } from "../types/auth-payload";
import { verifyToken } from "../utils/jwt-helper";
import { TokenExpiredError } from "jsonwebtoken";
export const AuthMiddleware = async (
  req: Request, // Request
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded: AuthPayload = verifyToken(
        token ? token : ""
      ) as AuthPayload;

      if (!decoded)
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ",
        });

      const user = await User.findById(decoded.id);
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Người dùng không tồn tại" });
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      } as AuthPayload; // Gán thông tin người dùng vào req
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return res
          .status(401)
          .json({ message: "Token expired. Please login again." });
      }
      return res.status(401).json({ message: "Invalid token." });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};
