// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { categoryService } from "../services/categoryService";

// export const useCategories = () => {
//   return useQuery({
//     queryKey: ["categories"],
//     queryFn: categoryService.getCategories,
//   });
// };

// export const useCreateCategory = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: categoryService.createCategory,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//     },
//   });
// };
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 60 * 60 * 1000, // 1h
  });

  const addMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, name),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return {
    data,
    isLoading,
    addMutation,
    updateMutation,
    deleteMutation,
  };
};
