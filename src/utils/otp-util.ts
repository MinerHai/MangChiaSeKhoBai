interface OtpEntry {
  code: string;
  expireAt: number;
}

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const otpStore = new Map<string, OtpEntry>(); // email -> OtpEntry
export function generateOtp(): string {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
}
export function saveOtp(userID: string, code: string) {
  // Nếu user đã có OTP thì xóa trước
  if (otpStore.has(userID)) {
    otpStore.delete(userID);
  }

  // Lưu OTP mới
  otpStore.set(userID, { code, expireAt: Date.now() + OTP_TTL_MS });
}
export function clearOtp(userID: string) {
  otpStore.delete(userID);
}
export function checkOtp(userID: string, code: string) {
  const entry = otpStore.get(userID);
  if (!entry)
    return {
      success: false,
      message: "Chưa gửi mã OTP",
    };
  if (entry.code !== code)
    return {
      success: false,
      message: "Mã OTP không hợp lệ",
    };
  if (entry.expireAt < Date.now()) {
    otpStore.delete(userID);
    return {
      success: false,
      message: "Mã OTP đã hết hạn",
    };
  }
  return { success: true, message: "Xác thực thành công" };
}
