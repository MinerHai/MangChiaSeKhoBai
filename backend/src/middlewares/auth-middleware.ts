import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AuthPayload } from "../types/auth-payload";
import { verifyToken } from "../utils/jwt-helper";
import { TokenExpiredError } from "jsonwebtoken";

/**
 * Middleware xác thực người dùng thông qua JWT lưu trong cookie
 */
export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 🔹 Lấy token từ cookie
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = verifyToken(token) as AuthPayload | null;

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Token không hợp lệ" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    } as AuthPayload;

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    console.error("AuthMiddleware error:", err);
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
