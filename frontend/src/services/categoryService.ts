import API from "./APIClient";

export interface Category {
  _id: string;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await API.get("/categories");
  return res.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const res = await API.post("/categories", { name });
  return res.data;
};

export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  const res = await API.put(`/categories/${id}`, { name });
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await API.delete(`/categories/${id}`);
};
