import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  incrementViews,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blog-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { authorizeRoles } from "../middlewares/role-middleware";
import upload from "../middlewares/multer-middleware";
const router = Router();

// CRUD routes
router.post(
  "/",
  AuthMiddleware,
  authorizeRoles("admin"),
  upload.single("coverImage"),
  createBlog
);
router.get("/", AuthMiddleware, getBlogs);
router.get("/:id", AuthMiddleware, getBlogById);
router.patch(
  "/:id",
  AuthMiddleware,
  authorizeRoles("admin"),
  upload.single("coverImage"),
  updateBlog
);
router.delete("/:id", AuthMiddleware, authorizeRoles("admin"), deleteBlog);

// Extra routes
router.patch(
  "/:id/publish",
  AuthMiddleware,
  authorizeRoles("admin"),
  togglePublishBlog
);
router.patch("/:id/views", AuthMiddleware, incrementViews);

export default router;
