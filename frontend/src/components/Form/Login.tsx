import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../../schemas/authSchema";
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
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { ROUTES } from "../../router";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await login(data.email, data.password);

      setMessage(res.message);
      navigate("/"); // điều hướng sau khi login thành công
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Login failed");
    }
  };

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
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
            Đăng nhập
          </Heading>

          {/* Email */}
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Login
          </Button>

          {message && (
            <Text textAlign="center" color="red.400">
              {message}
            </Text>
          )}

          <Text textAlign="center">
            Chưa có tài khoản?{" "}
            <ChakraLink
              as={RouterLink}
              to={ROUTES.REGISTER}
              color="teal.500"
              fontWeight="semibold"
            >
              Đăng ký
            </ChakraLink>
          </Text>
        </Stack>
      </chakra.form>
    </Box>
  );
}
