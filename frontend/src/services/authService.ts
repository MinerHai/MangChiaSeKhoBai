import axios from "axios";
import API from "./APIClient";

/** Đăng nhập */
export const login = async (email: string, password: string) => {
  try {
    // Cookie HttpOnly sẽ được tự động set trong trình duyệt
    const res = await API.post("/auth/login", { email, password });
    return res.data; // { success, message, user? }
  } catch (err) {
    handleAxiosError(err, "Đăng nhập thất bại");
  }
};

/** Đăng ký */
export const registerAuth = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await API.post("/auth/register", {
      username,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Đăng ký thất bại");
  }
};

/** Lấy thông tin người dùng hiện tại */
export const fetchUserProfile = async () => {
  try {
    console.log("FETCH /profile gọi");
    const res = await API.get("/auth/profile");
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lấy thông tin người dùng thất bại");
  }
};

/** Đổi avatar */
export const changeAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("images", file);

    const res = await API.post("/auth/change-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    handleAxiosError(err, "Đổi ảnh đại diện thất bại");
  }
};

/** Đổi mật khẩu */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const res = await API.post("/auth/change-password", data);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Đổi mật khẩu thất bại");
  }
};

/** Đăng xuất */
export const logout = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Đăng xuất thất bại");
  }
};
export const toggleTwoFactor = async (enable: boolean, password: string) => {
  try {
    const res = await API.post("/auth/two-factor", { enable, password });
    return res.data; // { success, message }
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as any)?.message ?? "Cập nhật 2FA thất bại";
      throw new Error(message);
    }
    throw err;
  }
};

/** Helper xử lý lỗi chung */
function handleAxiosError(err: unknown, defaultMessage: string): never {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as any)?.message ?? defaultMessage;
    throw new Error(message);
  }
  if (err instanceof Error) throw err;
  throw new Error(defaultMessage);
}
