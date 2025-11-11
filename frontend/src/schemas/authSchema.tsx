// schemas/authSchema.ts
import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username ít nhất 3 ký tự" })
    .max(20, { message: "Username tối đa 20 ký tự" })
    .refine((val) => !val.includes(" "), {
      message: "Username không được chứa khoảng trắng",
    }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().trim().regex(strongPasswordRegex, {
    message:
      "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Password ít nhất 6 ký tự"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim(),
    newPassword: z.string().trim().regex(strongPasswordRegex, {
      message:
        "Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
