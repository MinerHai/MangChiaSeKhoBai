import axios from "axios";
import API from "./APIClient";

export const login = async (email: string, password: string) => {
  try {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const message = (err.response?.data as any)?.message ?? "Login failed";
      throw new Error(message);
    }
    if (err instanceof Error) throw err;
    throw new Error("Login failed");
  }
};

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
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message = (err.response?.data as any)?.message ?? "Register failed";
      throw new Error(message);
    }
    if (err instanceof Error) throw err;
    throw new Error("Register failed");
  }
};

export const fetchUserProfile = async (token: string) => {
  try {
    const res = await API.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as any)?.message ?? "Lấy thông tin user thất bại";
      throw new Error(message);
    }
    if (err instanceof Error) throw err;
    throw new Error("Lấy thông tin user thất bại");
  }
};

export const changeAvatar = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("images", file);

  const res = await API.post("/auth/change-avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const changePassword = async (
  data: { currentPassword: string; newPassword: string },
  token: string
) => {
  const res = await API.post("/auth/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
