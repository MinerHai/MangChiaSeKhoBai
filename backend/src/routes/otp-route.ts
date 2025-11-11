import express from "express";
import {
  sendOtpLogin,
  verifyOtpLogin,
  sendOtpActivate,
  verifyOtpActivate,
} from "../controllers/otp-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const router = express.Router();

// 🔹 2FA khi đăng nhập (KHÔNG cần JWT)
router.post("/send-login", sendOtpLogin);
router.post("/verify-login", verifyOtpLogin);

// 🔹 OTP kích hoạt tài khoản
router.post("/send-activate", AuthMiddleware, sendOtpActivate);
router.post("/verify-activate", AuthMiddleware, verifyOtpActivate);

export default router;
