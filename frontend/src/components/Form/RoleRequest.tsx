import React, { useState } from "react";
import {
  Input,
  Button,
  Spinner,
  Text,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useSendOwnerRoleRequest } from "../../hooks/useRoleRequest";

export default function RoleRequestForm() {
  const [files, setFiles] = useState<File[]>([]);
  const toast = useToast();
  const token = localStorage.getItem("token");

  const mutation = useSendOwnerRoleRequest();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast({
        title: "Chưa chọn ảnh",
        description: "Vui lòng chọn ít nhất 1 ảnh.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    mutation.mutate(
      { files, token: token || "" },
      {
        onSuccess: (data) => {
          toast({
            title: "Thành công",
            description: data?.message || "Đã gửi yêu cầu!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setFiles([]);
        },
        onError: (err: any) => {
          toast({
            title: "Lỗi",
            description:
              err?.response?.data?.message || "Gửi yêu cầu thất bại!",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <HStack as="form" spacing={4} onSubmit={handleSubmit}>
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        border="1px solid"
        borderColor="gray.200"
      />
      {files.length > 0 && (
        <Text fontSize="sm" color="gray.500">
          Đã chọn {files.length} ảnh
        </Text>
      )}
      <Button type="submit" colorScheme="teal" isDisabled={mutation.isPending}>
        {mutation.isPending ? <Spinner size="sm" /> : "Gửi yêu cầu"}
      </Button>
    </HStack>
  );
}
