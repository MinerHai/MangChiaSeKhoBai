import express, { Request, Response } from "express";
import { ActivedAccountMiddleware } from "../middlewares/actived-middleware";
import { RequestRole } from "../models/RequestRole";
import upload from "../middlewares/multer-middleware";
import {
  requestRoleOwner,
  getAllRoleRequests,
  acceptRoleRequest,
  rejectRoleRequest,
} from "../controllers/role-controller";
import { authorizeRoles } from "../middlewares/role-middleware";
import { AuthMiddleware } from "../middlewares/auth-middleware";
const router = express.Router();

router.post(
  "/assign-owner",
  AuthMiddleware,
  ActivedAccountMiddleware,
  upload.array("images", 5), // Middleware để xử lý upload nhiều ảnh, tối đa 5 ảnh
  requestRoleOwner
);
router.get(
  "/requests",
  AuthMiddleware,
  authorizeRoles("admin"),
  getAllRoleRequests
);

router.post(
  "/accept-request/:id",
  AuthMiddleware,
  authorizeRoles("admin"),
  acceptRoleRequest
);
router.post(
  "/reject-request/:id",
  AuthMiddleware,
  authorizeRoles("admin"),
  rejectRoleRequest
);
export default router;
