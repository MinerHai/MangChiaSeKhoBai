import express from "express";
import {
  register,
  login,
  getProfile,
  ChangePassword,
} from "../controllers/auth-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", AuthMiddleware, getProfile);
router.post("/change-password", AuthMiddleware, ChangePassword);
export default router;
