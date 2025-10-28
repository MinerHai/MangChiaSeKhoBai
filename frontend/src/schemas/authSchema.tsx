// schemas/authSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username ít nhất 3 ký tự" })
    .refine((val) => val.length > 0, {
      message: "Username không được để trống",
    }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password ít nhất 6 ký tự" })
    .refine((val) => val.length > 0, {
      message: "Password không được để trống",
    })
    .refine((val) => !val.includes(" "), {
      message: "Mật khẩu không được chứa khoảng trắng",
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
    currentPassword: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu hiện tại phải có ít nhất 6 ký tự" })
      .refine((val) => val.length > 0, {
        message: "Không được để trống hoặc toàn khoảng trắng",
      })
      .refine((val) => !val.includes(" "), {
        message: "Mật khẩu không được chứa khoảng trắng",
      }),
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
      .refine((val) => val.length > 0, {
        message: "Không được để trống hoặc toàn khoảng trắng",
      })
      .refine((val) => !val.includes(" "), {
        message: "Mật khẩu không được chứa khoảng trắng",
      }),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
