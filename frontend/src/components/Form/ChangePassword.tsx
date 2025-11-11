import { changePasswordSchema } from "../../schemas/authSchema";
import type { ChangePasswordInput } from "../../schemas/authSchema";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../services/authService";

interface ChangePasswordFormProps {
  onClose: () => void;
}

export default function ChangePasswordForm({
  onClose,
}: ChangePasswordFormProps) {
  const [form, setForm] = useState<ChangePasswordInput>({
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordInput, string>>
  >({});
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: () => changePassword(form),
    onSuccess: (res) => {
      toast({
        title: res.message || "Đổi mật khẩu thành công!",
        status: "success",
        duration: 3000,
      });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";

      toast({
        title: "Đổi mật khẩu thất bại!",
        description: errorMessage,
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = changePasswordSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ChangePasswordInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutation.mutate();
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Mật khẩu hiện tại</FormLabel>
          <Input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
          />
          {errors.currentPassword && (
            <Text color="red.400" fontSize="sm">
              {errors.currentPassword}
            </Text>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mật khẩu mới</FormLabel>
          <Input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          {errors.newPassword && (
            <Text color="red.400" fontSize="sm">
              {errors.newPassword}
            </Text>
          )}
        </FormControl>

        <Button type="submit" colorScheme="teal" isLoading={mutation.isPending}>
          Đổi mật khẩu
        </Button>
      </VStack>
    </Box>
  );
}
