import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự"),
  body("name").notEmpty().withMessage("Tên không được để trống"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
];
