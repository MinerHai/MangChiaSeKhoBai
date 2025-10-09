import { saveOtp, generateOtp, checkOtp, clearOtp } from "../utils/otp-util";
import { sendEmail } from "../utils/email-util";
import { Request, Response } from "express";
import { AuthPayload } from "../types/auth-payload";
import { ActiveAccount } from "./auth-controller";

// Controller to send OTP
export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.user as AuthPayload;

    const otp = generateOtp();
    await sendEmail(email, otp);
    saveOtp(email, otp);
    return res.json({
      success: true,
      expireIn: 2 * 60, // 2 minutes in seconds
      otp: otp,
      message: "OTP đã được gửi tới email",
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    return res.status(500).json({ error: "Gửi OTP đã thật bại" });
  }
}
export async function verifyOtp(req: Request, res: Response) {
  try {
    const { id, email } = req.user as AuthPayload;
    const { otp } = req.body as { otp: string };
    if (!otp === undefined || otp.length !== 6) {
      return res
        .status(400)
        .json({ success: false, message: "OTP không hợp lệ" });
    }
    const { success, message } = checkOtp(email, otp);
    if (!success) {
      return res.status(400).json({ success, message });
    }

    // Xóa OTP sau khi xác thực thành công
    clearOtp(email);

    const { success: activeSuccess, message: activeMessage } =
      await ActiveAccount(id); // kích hoạt tài khoản
    return res.json({ success: activeSuccess, message: activeMessage });
  } catch (err: any) {
    console.error("OTP verification failed:", err);
    return res
      .status(500)
      .json({ error: "Xác thực OTP đã thất bại", message: err.message });
  }
}
