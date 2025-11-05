import API from "./APIClient";
import axios from "axios";

export const sendOtp = async () => {
  try {
    const res = await API.post("/otp/send-activate", {});
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as any)?.message ?? "Gửi OTP thất bại";
      throw new Error(message);
    }
    if (err instanceof Error) throw err;
    throw new Error("Gửi OTP thất bại");
  }
};

export const verifyOtp = async (otp: string) => {
  try {
    const res = await API.post("/otp/verify-activate", { otp });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as any)?.message ?? "Xác thực OTP thất bại";
      throw new Error(message);
    }
    if (err instanceof Error) throw err;
    throw new Error("Xác thực OTP thất bại");
  }
};

/** Gửi OTP để xác thực đăng nhập (2FA) */
export const sendLoginOtp = async (email: string) => {
  try {
    const res = await API.post("/otp/send-login", { email });
    return res.data; // { success, message, expireIn }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as any)?.message ?? "Gửi OTP thất bại";
      throw new Error(message);
    }
    throw new Error("Gửi OTP thất bại");
  }
};

/** Xác minh OTP đăng nhập (2FA) */
export const verifyLoginOtp = async (email: string, otp: string) => {
  try {
    const res = await API.post("/otp/verify-login", { email, otp });
    return res.data; // { success, message, user }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as any)?.message ?? "Xác thực OTP thất bại";
      throw new Error(message);
    }
    throw new Error("Xác thực OTP thất bại");
  }
};
