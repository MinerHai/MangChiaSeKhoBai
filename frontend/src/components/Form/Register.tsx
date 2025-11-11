import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  chakra,
  Link as ChakraLink,
  useToast,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterInput } from "../../schemas/authSchema";
import { registerAuth } from "../../services/authService";
import { ROUTES } from "../../router";
import { TermsModal } from "../TermsModal";
import OtpModal from "../OtpModal"; // ✅ import thêm

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const [agreed, setAgreed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // modal điều lệ
  const otpDisclosure = useDisclosure(); // modal OTP

  const onSubmit = async (data: RegisterInput) => {
    if (!agreed) {
      toast({
        title: "Chưa đồng ý điều lệ",
        description: "Bạn phải đọc và đồng ý điều lệ trước khi đăng ký",
        status: "warning",
      });
      return;
    }

    try {
      const res = await registerAuth(data.username, data.email, data.password);
      setMessage(res.message);
      toast({
        title: "Đăng ký thành công!",
        description: "Vui lòng xác minh email để kích hoạt tài khoản.",
        status: "info",
      });
      otpDisclosure.onOpen(); // ✅ mở modal OTP
    } catch (err: any) {
      console.error("ERR RESPONSE:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Đăng ký thất bại!";
      console.log("ERROR MSG:", errorMsg);

      setMessage(errorMsg);
      toast({
        title: "Đăng ký thất bại!",
        description: errorMsg, // 👈 nếu chuỗi này rỗng => không hiển thị
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={12}
      p={8}
      borderWidth="1px"
      borderRadius="lg"
      bg={cardBg}
      borderColor={cardBorder}
      boxShadow="sm"
    >
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={5}>
          <Heading size="lg" textAlign="center">
            Đăng ký tài khoản
          </Heading>

          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input id="username" {...register("username")} />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" {...register("email")} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" {...register("password")} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Checkbox
            isChecked={agreed}
            onChange={() => {
              if (!agreed) onOpen();
            }}
          >
            Tôi đồng ý điều lệ & chính sách
          </Checkbox>

          <TermsModal
            isOpen={isOpen}
            onClose={onClose}
            onAgree={() => setAgreed(true)}
          />

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            isDisabled={!agreed}
          >
            Đăng ký
          </Button>

          {message && (
            <Text textAlign="center" color="red.400">
              {message}
            </Text>
          )}

          <Text textAlign="center">
            Đã có tài khoản?{" "}
            <ChakraLink
              as={RouterLink}
              to={ROUTES.LOGIN}
              color="teal.500"
              fontWeight="semibold"
            >
              Đăng nhập
            </ChakraLink>
          </Text>
        </Stack>
      </chakra.form>

      {/* ✅ Modal OTP */}
      <OtpModal
        isOpen={otpDisclosure.isOpen}
        onClose={otpDisclosure.onClose}
        onSuccess={() => {
          toast({
            title: "Xác minh thành công!",
            description: "Tài khoản của bạn đã được kích hoạt.",
            status: "success",
          });
          otpDisclosure.onClose();
          navigate(ROUTES.LOGIN);
        }}
      />
    </Box>
  );
}
