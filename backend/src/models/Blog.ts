import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Types.ObjectId; // ref tới User
  coverImage?: {
    public_id: string;
    secure_url: string;
  };
  tags: string[];
  isPublished: boolean;
  views: number;
  category?: mongoose.Types.ObjectId; // ref tới Category
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề bài viết là bắt buộc"],
      trim: true,
      minlength: [5, "Tiêu đề quá ngắn (tối thiểu 5 ký tự)"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Nội dung bài viết không được để trống"],
      minlength: [20, "Nội dung cần ít nhất 20 ký tự"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Thiếu thông tin tác giả"],
    },
    coverImage: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Lượt xem không thể âm"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
