import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // tối đa 10 lần thử
  message: "Bạn đã thử đăng nhập quá nhiều lần, vui lòng thử lại sau 15 phút",
});
