import type { User } from "../stores/useAuthStore";
import API from "./APIClient";

export interface WarehouseUpload {
  _id?: string; // optional để không bắt buộc khi update
  warehouseId: string;
  name: string;
  location: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  capacity: number;
  ownerUserId?: string;
  ownerWallet: string;
  pricePerDayWei: string;
  depositWei: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  txHash?: string;
  imageFile?: File; // optional để không bắt buộc khi update
}
export interface WareHouseImage {
  public_id: string;
  secure_url: string;
}
export interface Warehouse {
  _id: string;
  warehouseId: string;
  name: string;
  location: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  capacity: number;
  ownerUserId?: User;
  ownerWallet: string;
  pricePerDayWei: string;
  depositWei: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  txHash?: string;
  images: WareHouseImage[];
}
export interface WarehouseResponse {
  items: Warehouse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface fetchWarehouseByIdResponse {
  success: boolean;
  data: Warehouse;
}

/**
 * Gửi thông tin kho (có thể kèm ảnh) lên backend
 * Backend phải hỗ trợ multipart/form-data
 */
export const saveWarehouseToBackend = async (data: WarehouseUpload) => {
  const formData = new FormData();

  // Chuyển tất cả field sang formData
  (Object.keys(data) as (keyof WarehouseUpload)[]).forEach((key) => {
    const value = data[key];
    if (value === undefined || value === null) return;

    if (key === "imageFile" && value instanceof File) {
      formData.append("images", value); // file thật
    } else if (key === "location" && typeof value === "object") {
      formData.append("location", JSON.stringify(value)); // chuyển json trước khi gọi backend
    } else {
      formData.append(key, String(value));
    }
  });
  console.log("FormData:", [...formData]); // 👀 debug

  // Gửi multipart/form-data
  const res = await API.post("/warehouses/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const fetchWarehouses = async (params?: {
  ownerWallet?: string;
  page?: number;
  limit?: number;
  ownerUserId?: string;
  keyword?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
}): Promise<WarehouseResponse> => {
  const res = await API.get("/warehouses", { params });
  return res.data;
};
export const fetchWarehouseById = async (id: string) => {
  const res = await API.get(`/warehouses/${id}`);
  return res.data;
};

export const updateWarehouseOnBackend = async (
  warehouse: WarehouseUpload,
  txHash?: string
) => {
  if (!warehouse._id) throw new Error("Thiếu _id khi update warehouse");

  const dataToSend: any = {
    ...warehouse,
    txHash,
  };

  const res = await API.put(
    `/warehouses/update/${warehouse._id}`,
    dataToSend,
    {}
  );

  return res.data;
};
export const deleteWarehouse = async (warehouseId: string) => {
  const res = await API.delete(`/warehouses/delete/${warehouseId}`);
  return res;
};
export const addWarehouseImages = async (
  warehouseId: string,
  files: File[]
): Promise<WareHouseImage[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await API.put(`/warehouses/${warehouseId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data.images; // backend trả về warehouse document, lấy mảng images
};
export const deleteWarehouseImage = async (
  warehouseId: string,
  public_id: string
): Promise<WareHouseImage[]> => {
  const res = await API.delete(
    `/warehouses/${warehouseId}/images/${public_id}`
  );
  return res.data.data.images; // trả về mảng images sau khi xóa
};
