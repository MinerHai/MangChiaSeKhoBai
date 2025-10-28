import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { AuthPayload } from "../types/auth-payload";
import { signToken } from "../utils/jwt-helper";
import { uploadMultipleImages } from "../utils/cloudinary-util";
import cloudinary from "../config/cloudinary";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã tồn tại! Vui lòng thay email hoặc tên đăng nhập",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại! Vui lòng kiểm tra lại",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại",
      });
    }

    const token = await signToken({
      id: existingUser._id ? existingUser._id.toString() : "",
      email: existingUser.email,
      username: existingUser.username,
      role: existingUser.role,
    });
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthPayload;
    const currentUser = await User.findById(user.id).select("-password");
    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};

export const ActiveAccount = async (userID: string) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    user.isActive = true;
    await user.save();
    return { success: true, message: "Kích hoạt tài khoản thành công" };
  } catch (error: any) {
    console.error("Account activation failed:", error);
    return {
      success: false,
      message: error.message || "Kích hoạt tài khoản thất bại",
    };
  }
};

export const ChangePassword = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthPayload;
    const { currentPassword, newPassword } = req.body;
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // console.error("Current Password:", currentPassword);
    // console.error("Existing User Password Hash:", existingUser.password);
    // console.error("New password", newPassword);

    const isMatch = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không chính xác",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};

export const ChangeAvatar = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthPayload;

    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Xử lý upload hình ảnh qua multer middleware
    const files = req.files as Express.Multer.File[];
    console.log(files);
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng upload ít nhất một hình ảnh" });
    }
    const filePaths = files.map((f) => f.path);

    // Upload lên Cloudinary
    const images = await uploadMultipleImages(filePaths, "avatar"); // { public_id, secure_url }[]

    if (images.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Upload hình ảnh thất bại! Vui lòng thử lại", // Upload lên cloud thất bại
      });
    }
    if (existingUser.avatar && existingUser.avatar.public_id) {
      // Xoá ảnh cũ trên Cloudinary nếu có
      await cloudinary.uploader.destroy(String(existingUser.avatar.public_id));
    }
    const firstImage = images[0];
    if (!firstImage) {
      return res.status(500).json({
        success: false,
        message: "Upload hình ảnh thất bại! Vui lòng thử lại",
      });
    }

    existingUser.avatar = {
      public_id: firstImage.public_id,
      secure_url: firstImage.secure_url,
    } as any;
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Thêm ảnh đại diện thành công",
      user: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};
