import express from "express";
import {
  addWarehouseImages,
  createWarehouse,
  deleteWarehouse,
  deleteWarehouseImage,
  getWarehouseById,
  listWarehouses,
  updateWarehouse,
} from "../controllers/warehouse-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { authorizeRoles } from "../middlewares/role-middleware";
import upload from "../middlewares/multer-middleware";
const router = express.Router();

router.get("/", AuthMiddleware, listWarehouses);
router.post(
  "/add",
  AuthMiddleware,
  authorizeRoles("admin", "owner"),
  upload.array("images", 5),
  createWarehouse
);
router.put("/update/:id", AuthMiddleware, updateWarehouse);
router.get("/:id", AuthMiddleware, getWarehouseById);
router.delete("/delete/:id", AuthMiddleware, deleteWarehouse);

//thêm images của warehouse
router.post(
  "/:id/images",
  AuthMiddleware,
  upload.array("images", 5),
  addWarehouseImages
);

// xóa image của warehouse
router.delete("/:id/images/:public_id", AuthMiddleware, deleteWarehouseImage);

export default router;
