import React, { useState } from "react";
import {
  Input,
  Button,
  Spinner,
  Text,
  useToast,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useSendOwnerRoleRequest } from "../../hooks/useRoleRequest";

export default function RoleRequestForm() {
  const [files, setFiles] = useState<File[]>([]);
  const toast = useToast();
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

    mutation.mutate(files, {
      onSuccess: () => setFiles([]),
    });
  };

  return (
    <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      {files.length > 0 && (
        <Text fontSize="sm">Đã chọn {files.length} ảnh</Text>
      )}
      <HStack justify="flex-end">
        <Button
          type="submit"
          colorScheme="teal"
          isDisabled={mutation.isPending}
        >
          {mutation.isPending ? <Spinner size="sm" /> : "Gửi yêu cầu"}
        </Button>
      </HStack>
    </VStack>
  );
}
