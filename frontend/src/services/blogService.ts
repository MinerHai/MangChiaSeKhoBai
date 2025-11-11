import API from "./APIClient";

export interface BlogPayload {
  _id?: string;
  title: string;
  content: string;
  author: string;
  tags?: string[];
  categoryId?: string;
  coverImage?: File;
}

export const blogService = {
  getBlogs: async (params?: {
    search?: string;
    category?: string;
    tag?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const { data } = await API.get("blogs", { params });
    return data;
  },

  getBlogById: async (id: string) => {
    const { data } = await API.get(`blogs/${id}`);
    return data;
  },

  createBlog: async (payload: BlogPayload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    if (payload.categoryId) formData.append("categoryId", payload.categoryId);
    if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
    if (payload.coverImage) formData.append("coverImage", payload.coverImage);

    const { data } = await API.post("blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateBlog: async (id: string, payload: Partial<BlogPayload>) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as any);
    });
    const { data } = await API.patch(`blogs/${id}`, formData);
    return data;
  },

  deleteBlog: async (id: string) => {
    const { data } = await API.delete(`blogs/${id}`);
    return data;
  },
};
