import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { AuthPayload } from "../types/auth-payload";
import { signToken } from "../utils/jwt-helper";

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
