import API from "./APIClient";

export const SendOwnerRoleRequest = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  try {
    const res = await API.post("/role/assign-owner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
