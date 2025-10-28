import express from "express";
import {
  register,
  login,
  getProfile,
  ChangePassword,
  ChangeAvatar,
} from "../controllers/auth-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import upload from "../middlewares/multer-middleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", AuthMiddleware, getProfile);
router.post("/change-password", AuthMiddleware, ChangePassword);
router.post(
  "/change-avatar",
  AuthMiddleware,
  upload.array("images", 1),
  ChangeAvatar
);
export default router;
