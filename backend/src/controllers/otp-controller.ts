import { Request, Response } from "express";
import { saveOtp, generateOtp, checkOtp, clearOtp } from "../utils/otp-util";
import { sendEmail } from "../utils/email-util";
import User from "../models/User";
import { signToken } from "../utils/jwt-helper";
import { ActiveAccount } from "./auth-controller";

// ===============================
// 🔹 OTP CHO LOGIN (2FA)
// ===============================

export async function sendOtpLogin(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Thiếu email" });

    const otp = generateOtp();
    saveOtp(email, otp);
    await sendEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP đăng nhập đã được gửi tới email",
      expireIn: 2 * 60,
    });
  } catch (err) {
    console.error("sendOtpLogin error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Gửi OTP thất bại" });
  }
}

export async function verifyOtpLogin(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu email hoặc OTP" });

    const { success, message } = checkOtp(email, otp);
    if (!success) return res.status(400).json({ success, message });

    clearOtp(email);

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });

    // ✅ Đăng nhập thành công → tạo JWT cookie
    const token = await signToken({
      id: String(user._id),
      email: user.email,
      username: user.username,
      role: user.role,
    });
    console.log("✅ Cookie set for:", email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Xác thực OTP đăng nhập thành công",
      user,
    });
  } catch (err) {
    console.error("verifyOtpLogin error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Xác thực OTP thất bại" });
  }
}

// ===============================
// 🔹 OTP KÍCH HOẠT TÀI KHOẢN (CÓ JWT)
// ===============================

export async function sendOtpActivate(req: Request, res: Response) {
  try {
    const { email } = req.user!;
    const otp = generateOtp();
    saveOtp(email, otp);
    await sendEmail(email, otp);
    return res.json({
      success: true,
      message: "OTP kích hoạt tài khoản đã được gửi",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Gửi OTP kích hoạt thất bại" });
  }
}

export async function verifyOtpActivate(req: Request, res: Response) {
  try {
    const { id, email } = req.user!;
    const { otp } = req.body;
    const { success, message } = checkOtp(email, otp);
    if (!success) return res.status(400).json({ success, message });

    clearOtp(email);
    const result = await ActiveAccount(id);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Xác thực OTP kích hoạt thất bại" });
  }
}
