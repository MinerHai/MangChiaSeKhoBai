// src/schemas/warehouseSchema.ts
import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Tên kho bắt buộc"),
  province: z.string().min(1, "Chọn tỉnh/thành phố"),
  district: z.string().min(1, "Chọn quận/huyện"),
  ward: z.string().min(1, "Chọn xã/phường"),
  street: z.string().min(1, "Nhập đường/phố"),
  capacity: z
    .string()
    .regex(/^[0-9]+$/, "Dung tích phải là số")
    .transform((v) => parseInt(v, 10)),
  pricePerDayWei: z
    .string()
    .regex(/^[0-9]+$/, "Giá thuê mỗi ngày phải là số (wei)"),
  depositWei: z.string().regex(/^[0-9]+$/, "Tiền cọc phải là số (wei)"),
  description: z.string().optional(),
  imageFile: z.instanceof(File).optional().or(z.undefined()), // hoặc .nonempty nếu bắt buộc
});

export type RegisterWarehouseForm = z.infer<typeof warehouseSchema>;
