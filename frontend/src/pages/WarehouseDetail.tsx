import {
  Box,
  Image,
  Text,
  Stack,
  Heading,
  Spinner,
  Center,
  Button,
  HStack,
  VStack,
  IconButton,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchWarehouseById,
  type Warehouse,
} from "../services/warehouseService";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  InfoIcon,
  AtSignIcon,
  PhoneIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../stores/useAuthStore";
import { ROUTES } from "../router";

export default function WarehouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => fetchWarehouseById(id || ""),
    enabled: !!id,
  });

  const MotionImage = motion(Image);
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  if (isLoading)
    return (
      <Center h="80vh">
        <Spinner size="xl" />
      </Center>
    );

  if (isError || !data?.data)
    return (
      <Center h="80vh" flexDir="column">
        <Text mb={4}>Không thể tải thông tin kho hàng.</Text>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </Center>
    );

  const warehouse = data.data as Warehouse;
  const images = warehouse.images || [];

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % (images.length || 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Box p={6} maxW="6xl" mx="auto">
      {/* Header */}
      <HStack justifyContent="space-between" mb={4}>
        <Button onClick={() => navigate(-1)} colorScheme="teal">
          ← Quay lại
        </Button>
        {warehouse.ownerUserId?._id === user?._id && (
          <Button
            leftIcon={<EditIcon />}
            colorScheme="orange"
            onClick={() => navigate(ROUTES.USER_WAREHOUSES_EDIT(warehouse._id))}
          >
            Chỉnh sửa
          </Button>
        )}
      </HStack>

      {/* Layout 2 cột */}
      <HStack
        align="start"
        spacing={8}
        flexDirection={{ base: "column", md: "row" }}
      >
        {/* Carousel ảnh bên trái */}
        <Box
          position="relative"
          overflow="hidden"
          borderRadius="xl"
          boxShadow="lg"
          bg={bg}
          flex="1"
          h={{ base: "250px", md: "400px" }}
        >
          {images.length > 0 ? (
            <AnimatePresence initial={false}>
              <MotionImage
                key={current}
                src={images[current].secure_url}
                alt={warehouse.name}
                objectFit="cover"
                w="100%"
                h="100%"
                position="absolute"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
          ) : (
            <Center h="100%">
              <Text color="gray.500">Không có hình ảnh</Text>
            </Center>
          )}

          {images.length > 1 && (
            <>
              <IconButton
                aria-label="Trước"
                icon={<ChevronLeftIcon />}
                position="absolute"
                top="50%"
                left="10px"
                transform="translateY(-50%)"
                onClick={prevSlide}
                colorScheme="teal"
                borderRadius="full"
                opacity={0.8}
              />
              <IconButton
                aria-label="Sau"
                icon={<ChevronRightIcon />}
                position="absolute"
                top="50%"
                right="10px"
                transform="translateY(-50%)"
                onClick={nextSlide}
                colorScheme="teal"
                borderRadius="full"
                opacity={0.8}
              />
            </>
          )}
        </Box>

        {/* Thông tin bên phải */}
        <VStack
          flex="1"
          align="stretch"
          spacing={6}
          p={6}
          borderRadius="xl"
          bg={cardBg}
          boxShadow="md"
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }}>
            {warehouse.name}
          </Heading>
          <Text color="gray.600">{warehouse.description}</Text>

          <HStack wrap="wrap" spacing={4}>
            <Badge colorScheme="teal" px={3} py={1} borderRadius="md">
              <InfoIcon mr={1} />{" "}
              {warehouse.location.district || "Chưa xác định"}
            </Badge>
            <Badge colorScheme="purple" px={3} py={1} borderRadius="md">
              📦 {warehouse.capacity} m³
            </Badge>
            <Badge colorScheme="orange" px={3} py={1} borderRadius="md">
              💰 {parseFloat(warehouse.pricePerDayWei || "0") / 1e18} ETH/ngày
            </Badge>
            <Badge colorScheme="green" px={3} py={1} borderRadius="md">
              👤 {warehouse.ownerUserId?.username || "Ẩn danh"}
            </Badge>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="md">
              <AtSignIcon mr={1} /> {warehouse.ownerWallet}
            </Badge>
          </HStack>

          {/* Button Liên hệ & Thuê */}
          <HStack spacing={4} mt={4}>
            <Button
              leftIcon={<PhoneIcon />}
              colorScheme="teal"
              flex="1"
              onClick={() => alert("Mở form liên hệ hoặc gọi API")}
            >
              Liên hệ
            </Button>
            <Button
              colorScheme="orange"
              flex="1"
              onClick={() => navigate(`/checkout/${id}`)}
            >
              Thuê ngay
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}
