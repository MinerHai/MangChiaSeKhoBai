import { Request, Response } from "express";
import { Category } from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Danh mục đã tồn tại" });

    const category = await Category.create({ name, slug, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo danh mục", error });
  }
};

export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh mục", error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });

    if (name) {
      const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
      const duplicate = await Category.findOne({ slug, _id: { $ne: id } });
      if (duplicate)
        return res.status(400).json({ message: "Tên danh mục đã tồn tại" });

      category.name = name;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật danh mục", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json({ message: "Đã xoá danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xoá danh mục", error });
  }
};
