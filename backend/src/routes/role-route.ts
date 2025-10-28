import express from "express";
import { ActivedAccountMiddleware } from "../middlewares/actived-middleware";
import upload from "../middlewares/multer-middleware";
import {
  requestRoleOwner,
  getAllRoleRequests,
  getRoleRequestDetail,
  ResponseRoleRequest,
} from "../controllers/role-controller";
import { authorizeRoles } from "../middlewares/role-middleware";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { get } from "http";
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
router.get(
  "/requests/:id",
  AuthMiddleware,
  authorizeRoles("admin"),
  getRoleRequestDetail
);
router.post(
  "/response-request/:id",
  AuthMiddleware,
  authorizeRoles("admin"),
  ResponseRoleRequest
);

export default router;
