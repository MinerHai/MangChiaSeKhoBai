import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { SendOwnerRoleRequest } from "../services/requestService";

export const useSendOwnerRoleRequest = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: async (files: File[]) => await SendOwnerRoleRequest(files),
    onSuccess: (data) => {
      toast({
        title: "Thành công",
        description: data?.message || "Đã gửi yêu cầu!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Lỗi",
        description: err?.message || "Gửi yêu cầu thất bại!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
  });
};
