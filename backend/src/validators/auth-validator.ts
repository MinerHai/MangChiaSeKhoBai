import { body } from "express-validator";

export const registerValidator = [
  body("email").trim().isEmail().withMessage("Email không hợp lệ"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 3, max: 20 })
    .withMessage("Tên phải từ 3-20 ký tự"),

  body("password")
    .notEmpty()
    .withMessage("Vui lòng nhập mật khẩu")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[a-z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ thường")
    .matches(/[0-9]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 số")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
];
