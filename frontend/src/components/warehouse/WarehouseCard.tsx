import {
  Box,
  Image,
  Text,
  HStack,
  Stack,
  Heading,
  Card,
  CardBody,
  Button,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaRulerCombined,
  FaDollarSign,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Warehouse } from "../../services/warehouseService";
import { ROUTES } from "../../router";
interface Props {
  warehouse: Warehouse;
}
export default function WarehouseCard({ warehouse }: Props) {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const colorMode = useColorModeValue("gray.800", "whiteAlpha.900");
  const handleImageError = (e: any) => {
    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
  };

  return (
    <Card
      maxW="sm"
      bg={cardBg}
      shadow="md"
      borderRadius="2xl"
      color={colorMode}
      overflow="hidden"
      transition="all 0.3s ease"
      cursor="pointer"
      _hover={{
        transform: "translateY(-8px)",
        shadow: "2xl",
        bg: hoverBg,
      }}
    >
      {/* Ảnh kho */}
      <Box position="relative" overflow="hidden" h="200px">
        <Image
          src={
            warehouse.images?.[0]?.secure_url ||
            "https://via.placeholder.com/300x200"
          }
          alt={warehouse.name}
          objectFit="cover"
          w="100%"
          h="100%"
          transition="all 0.4s ease"
          _hover={{ transform: "scale(1.05)" }}
          onClick={() => navigate(`/warehouses/${warehouse._id}`)}
          onError={handleImageError}
        />
        {/* Overlay nhẹ */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="40%"
          bgGradient="linear(to-t, rgba(0,0,0,0.5), transparent)"
        />

        {/* Trạng thái thuê */}
        <Badge
          position="absolute"
          top="3"
          left="3"
          colorScheme={warehouse.isRenting ? "red" : "green"}
          fontSize="0.75rem"
          fontWeight="bold"
          rounded="md"
          px={2}
          py={1}
        >
          {warehouse.isRenting ? "Đã được thuê" : "Có thể thuê"}
        </Badge>
      </Box>

      <CardBody>
        <Stack spacing={3}>
          {/* Tên kho */}
          <Heading
            fontSize="xl"
            noOfLines={1}
            onClick={() =>
              navigate(`${ROUTES.WAREHOUSE_DETAIL(warehouse._id)}`)
            }
            _hover={{ color: "teal.500" }}
            transition="color 0.2s ease"
          >
            {warehouse.name}
          </Heading>

          {/*Địa chỉ*/}
          <HStack spacing={1}>
            <Icon as={FaMapMarkerAlt} />
            <Text fontSize="sm" fontWeight="semibold">
              {warehouse.location.province}
            </Text>
          </HStack>
          {/* Kích thước */}
          <HStack spacing={2}>
            <Icon as={FaRulerCombined} color="gray.500" />
            <Text fontSize="sm">
              {warehouse.capacity
                ? `Kích thước: ${warehouse.capacity}`
                : "Không rõ kích thước"}
            </Text>
          </HStack>

          {/* Giá */}
          <HStack spacing={2}>
            <Icon as={FaDollarSign} color="green.400" />
            <Text fontSize="sm" fontWeight="semibold">
              {warehouse.pricePerDayWei
                ? `${warehouse.pricePerDayWei.toLocaleString()} Wei/Ngày`
                : "Chưa có giá"}
            </Text>
          </HStack>

          {/* Người đăng */}
          <HStack spacing={2}>
            <Icon as={FaUser} color="blue.400" />
            <Text fontSize="sm">
              {warehouse.ownerUserId?.username
                ? `Người đăng: ${warehouse.ownerUserId.username}`
                : "Người đăng: Ẩn danh"}
            </Text>
          </HStack>

          {/* Nút xem chi tiết */}
          <Box pt={2}>
            <Button
              size="sm"
              w="full"
              bgGradient="linear(to-r, teal.400, cyan.500)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, teal.500, cyan.600)",
                transform: "scale(1.02)",
              }}
              transition="all 0.2s ease"
              onClick={() => navigate(ROUTES.WAREHOUSE_DETAIL(warehouse._id))}
            >
              Xem chi tiết
            </Button>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
