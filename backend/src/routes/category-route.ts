import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { authorizeRoles } from "../middlewares/role-middleware";
const router = Router();

router.post("/", AuthMiddleware, authorizeRoles("admin"), createCategory);
router.get("/", AuthMiddleware, getCategories);

router.put("/:id", AuthMiddleware, authorizeRoles("admin"), updateCategory);
router.delete("/:id", AuthMiddleware, authorizeRoles("admin"), deleteCategory);
export default router;
