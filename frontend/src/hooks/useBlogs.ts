import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService, type BlogPayload } from "../services/blogService";

export const useBlogs = (filters?: {
  search?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["blogs", filters],
    queryFn: () => blogService.getBlogs(filters),
    staleTime: 60 * 60 * 1000, // 1h
  });
};

export const useBlogDetail = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getBlogById(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1h
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlogPayload) => blogService.createBlog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BlogPayload>;
    }) => blogService.updateBlog(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useLatestBlogs = () => {
  return useQuery({
    queryKey: ["latest-blogs"],
    queryFn: () =>
      blogService.getBlogs({
        limit: 3,
        page: 1,
        sort: "-createdAt",
      }),
    staleTime: 60 * 60 * 1000, // 1h cache
  });
};
