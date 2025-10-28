import API from "./APIClient";

export const SendOwnerRoleRequest = async (files: File[], token: string) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await API.post("/role/assign-owner", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
