import { useMutation } from "@tanstack/react-query";
import { SendOwnerRoleRequest } from "../services/requestService";

export const useSendOwnerRoleRequest = () => {
  return useMutation({
    mutationFn: async ({ files, token }: { files: File[]; token: string }) => {
      return await SendOwnerRoleRequest(files, token);
    },
  });
};
