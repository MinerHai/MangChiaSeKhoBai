import { Request, Response } from "express";
import { cleanHTML } from "../utils/sanitize";
import { Blog } from "../models/Blog";
import { Category } from "../models/Category";
import { deleteImage, uploadImage } from "../utils/cloudinary-util";
import mongoose from "mongoose";

/** -------------------- TẠO BLOG -------------------- */

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, categoryId } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });

    const slug = title.toLowerCase().trim().replace(/\s+/g, "-");
    const cleanContent = cleanHTML(content);

    // Upload ảnh nếu có file
    let coverImage;
    if (req.file?.path) {
      const uploaded = await uploadImage(req.file.path, "blogs");
      coverImage = uploaded;
    }
    const author = req.user?.id;

    const blog = await Blog.create({
      author,
      title,
      slug,
      content: cleanContent,
      tags,
      category: categoryId || undefined,
      coverImage,
    });

    res.status(201).json({
      message: "Tạo bài viết thành công",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tạo blog", error });
  }
};
/** -------------------- LẤY DANH SÁCH BLOG -------------------- */
/**
 * Lấy danh sách blog (có filter, search, sort, pagination)
 * GET /api/blogs
 */
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      tag,
      limit = 5,
      page = 1,
      published,
      sort = "-createdAt",
    } = req.query;

    const filter: Record<string, any> = {};

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    if (tag) filter.tags = { $in: [tag] };

    if (search) filter.title = { $regex: search, $options: "i" };

    if (published === "true") filter.isPublished = true;

    // 📄 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("category", "name slug")
        .populate("author", "name email")
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      blogs,
    });
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách blog:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách blog",
      error: error.message,
    });
  }
};

/** -------------------- LẤY BLOG THEO SLUG -------------------- */
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("author", "name email");

    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy bài viết", error });
  }
};

/**-------------------------LẤY BLOG THEO ID */
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("req.params.id:", req.params.id);
    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const blog = await Blog.findById(id)
      .populate("category", "name slug")
      .populate("author", "username email");

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Lỗi getBlogById:", error);
    res.status(500).json({ message: "Lỗi lấy bài viết", error });
  }
};

/** -------------------- CẬP NHẬT BLOG -------------------- */
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, categoryId } = req.body;

    const blog = await Blog.findById(id);
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // Nếu có file mới → upload mới và xóa ảnh cũ
    if (req.file?.path) {
      if (blog.coverImage?.public_id) {
        await deleteImage(blog.coverImage.public_id);
      }
      const uploaded = await uploadImage(req.file.path, "blogs");
      blog.coverImage = uploaded;
    }

    if (title) {
      blog.title = title;
      blog.slug = title.toLowerCase().trim().replace(/\s+/g, "-");
    }
    if (content) blog.content = cleanHTML(content);
    if (tags) blog.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    if (categoryId) blog.category = categoryId;

    await blog.save();

    res.json({
      message: "Cập nhật thành công",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật blog", error });
  }
};

/** -------------------- XÓA BLOG -------------------- */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // Xóa ảnh Cloudinary nếu có
    if (blog.coverImage?.public_id) {
      await deleteImage(blog.coverImage.public_id);
    }

    await blog.deleteOne();
    res.json({ message: "Đã xóa bài viết", blog });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa blog", error });
  }
};

/** -------------------- PUBLISH / UNPUBLISH -------------------- */
export const togglePublishBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({
      message: blog.isPublished ? "Đã xuất bản bài viết" : "Đã gỡ bài viết",
      isPublished: blog.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi publish/unpublish", error });
  }
};
