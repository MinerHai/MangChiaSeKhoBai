import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLocation, useRouteError, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeError = useRouteError() as any;
  const navError = location.state;

  // Ưu tiên lỗi từ navigate > lỗi router > fallback
  const error = navError || routeError || {};
  const status = error.status || 404;

  const getErrorContent = (status: number) => {
    switch (status) {
      case 404:
        return {
          title: "404 - Không tìm thấy trang",
          message: "Trang bạn đang tìm có thể đã bị xóa hoặc không tồn tại.",
        };
      case 403:
        return {
          title: "403 - Truy cập bị từ chối",
          message: "Bạn không có quyền truy cập vào trang này.",
        };
      case 500:
        return {
          title: "500 - Lỗi máy chủ",
          message: "Có lỗi xảy ra ở phía máy chủ. Vui lòng thử lại sau.",
        };
      default:
        return {
          title: "Đã xảy ra lỗi",
          message: "Có gì đó không ổn. Hãy thử tải lại trang.",
        };
    }
  };

  const { title, message } = getErrorContent(status);
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={bg}
      h="75vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <VStack spacing={6} textAlign="center">
        <Image
          src={logo}
          alt={title}
          maxH="100px" // Giới hạn chiều cao
          objectFit="contain" // Giữ tỉ lệ ảnh
        />

        <Heading>{title}</Heading>
        <Text color="gray.500">{message}</Text>
        <Button
          colorScheme="teal"
          onClick={() => navigate("/")}
          size="lg"
          px={8}
        >
          Quay lại trang chủ
        </Button>
      </VStack>
    </Box>
  );
}
