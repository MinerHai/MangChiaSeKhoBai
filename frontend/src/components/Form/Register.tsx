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
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterInput } from "../../schemas/authSchema";
import { registerAuth } from "../../services/authService";
import { ROUTES } from "../../router";
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

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await registerAuth(data.username, data.email, data.password);
      setMessage(res.message);
      toast({
        title: "Đăng ký thành công!",
        description: res.message,
      });
      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Đăng ký thất bại");
      toast({
        title: "Đăng ký thất bại!",
        description: err instanceof Error ? err.message : "Đăng ký thất bại",
        status: "error",
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
            Register
          </Heading>

          {/* Username */}
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              {...register("username")}
              placeholder="Enter username"
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Register
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
    </Box>
  );
}
