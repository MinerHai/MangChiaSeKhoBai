import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  ChangePassword,
  ChangeAvatar,
  toggleTwoFactor,
} from "../controllers/auth-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import upload from "../middlewares/multer-middleware";
import { loginLimiter } from "../middlewares/security/rate-limit";
import { validate } from "../middlewares/validate";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth-validator";
const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginLimiter, loginValidator, validate, login); // thêm vô chống brute-force
router.get("/profile", AuthMiddleware, getProfile);
router.post("/change-password", AuthMiddleware, ChangePassword);
router.post(
  "/change-avatar",
  AuthMiddleware,
  upload.array("images", 1),
  ChangeAvatar
);
router.post("/logout", logout);
router.post("/two-factor", AuthMiddleware, toggleTwoFactor);
export default router;
