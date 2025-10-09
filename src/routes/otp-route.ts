import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
const router = express.Router();

router.post("/send", AuthMiddleware, sendOtp);
router.post("/verify", AuthMiddleware, verifyOtp);
export default router;
