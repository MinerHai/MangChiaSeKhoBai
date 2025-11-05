import {
  AtSignIcon,
  AttachmentIcon, // Thay cho CreditCardIcon / Wallet
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  HamburgerIcon, // Thay cho BoxIcon / Package
  InfoIcon, // Thay cho LocationIcon / MapPin
  PhoneIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../router";
import {
  fetchWarehouseById,
  type Warehouse,
} from "../services/warehouseService";
import { useAuth } from "../stores/useAuthStore";
import RentWarehouseModal from "../components/RentWarehouseModal";

export default function WarehouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => fetchWarehouseById(id || ""),
    enabled: !!id,
  });

  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  if (isLoading)
    return (
      <Center h="80vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );

  if (isError || !data?.data)
    return (
      <Center h="80vh" flexDir="column" gap={4}>
        <Text fontSize="lg" color="red.500">
          Không thể tải thông tin kho hàng.
        </Text>
        <Button onClick={() => refetch()} colorScheme="teal">
          Thử lại
        </Button>
      </Center>
    );

  const warehouse = data.data as Warehouse;
  const images = warehouse.images || [];
  const location = warehouse.location || {};

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % (images.length || 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const MotionImage = motion(Image);

  return (
    <Box p={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={3}
      >
        <Button
          leftIcon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
          colorScheme="teal"
          variant="outline"
          size={{ base: "sm", md: "md" }}
        >
          Quay lại
        </Button>

        {warehouse.ownerUserId?._id === user?._id && (
          <Button
            leftIcon={<EditIcon />}
            colorScheme="orange"
            size={{ base: "sm", md: "md" }}
            onClick={() => navigate(ROUTES.USER_WAREHOUSES_EDIT(warehouse._id))}
          >
            Chỉnh sửa
          </Button>
        )}
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 6, lg: 8 }}
        alignItems="start"
      >
        {/* Carousel Ảnh */}
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          bg={bg}
          h={{ base: "280px", md: "420px", lg: "500px" }}
        >
          {images.length > 0 ? (
            <>
              <AnimatePresence initial={false} mode="wait">
                <MotionImage
                  key={current}
                  src={images[current].secure_url}
                  alt={`${warehouse.name} - ảnh ${current + 1}`}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <IconButton
                    aria-label="Ảnh trước"
                    icon={<ChevronLeftIcon boxSize={6} />}
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={prevSlide}
                    colorScheme="whiteAlpha"
                    bg="blackAlpha.600"
                    _hover={{ bg: "blackAlpha.800" }}
                    borderRadius="full"
                    size="lg"
                    zIndex={1}
                  />
                  <IconButton
                    aria-label="Ảnh sau"
                    icon={<ChevronRightIcon boxSize={6} />}
                    position="absolute"
                    right={3}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={nextSlide}
                    colorScheme="whiteAlpha"
                    bg="blackAlpha.600"
                    _hover={{ bg: "blackAlpha.800" }}
                    borderRadius="full"
                    size="lg"
                    zIndex={1}
                  />

                  <HStack
                    position="absolute"
                    bottom={4}
                    left="50%"
                    transform="translateX(-50%)"
                    spacing={2}
                  >
                    {images.map((_, index) => (
                      <Box
                        key={index}
                        w={current === index ? 3 : 2}
                        h={current === index ? 3 : 2}
                        borderRadius="full"
                        bg={current === index ? "white" : "whiteAlpha.600"}
                        transition="all 0.3s"
                        cursor="pointer"
                        onClick={() => setCurrent(index)}
                      />
                    ))}
                  </HStack>
                </>
              )}
            </>
          ) : (
            <Center h="100%" flexDir="column" color="gray.500">
              <HamburgerIcon boxSize={16} mb={3} />
              <Text>Chưa có hình ảnh</Text>
            </Center>
          )}
        </Box>

        {/* Thông tin chi tiết */}
        <VStack
          align="stretch"
          spacing={5}
          p={{ base: 5, md: 6 }}
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            color={useColorModeValue("gray.800", "white")}
            lineHeight="shorter"
          >
            {warehouse.name}
          </Heading>

          <Text color={textColor} fontSize="lg" noOfLines={3}>
            {warehouse.description || "Không có mô tả."}
          </Text>

          <Divider />

          {/* Thông tin chính */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            <Tag size="lg" colorScheme="teal" borderRadius="full">
              <TagLeftIcon as={HamburgerIcon} />
              <TagLabel>{warehouse.capacity} m³</TagLabel>
            </Tag>

            <Tag size="lg" colorScheme="orange" borderRadius="full">
              <TagLeftIcon as={AttachmentIcon} />
              <TagLabel>
                {(parseFloat(warehouse.pricePerDayWei || "0") / 1e18).toFixed(
                  6
                )}{" "}
                ETH/ngày
              </TagLabel>
            </Tag>

            <Tag size="lg" colorScheme="purple" borderRadius="full">
              <TagLeftIcon as={CalendarIcon} />
              <TagLabel>
                {warehouse.isRenting ? "Đã thuê" : "Còn trống"}
              </TagLabel>
            </Tag>

            <Tag size="lg" colorScheme="blue" borderRadius="full">
              <TagLeftIcon as={AtSignIcon} />
              <TagLabel>
                {warehouse.ownerUserId?.username || "Ẩn danh"}
              </TagLabel>
            </Tag>
          </SimpleGrid>

          {/* Địa chỉ chi tiết */}
          <Box>
            <Flex align="center" gap={2} mb={2} color={mutedText}>
              <InfoIcon />
              <Text fontWeight="semibold">Địa chỉ chi tiết</Text>
            </Flex>
            <VStack align="start" spacing={1} fontSize="sm" color={textColor}>
              {location.street && (
                <Text>
                  <strong>Đường:</strong> {location.street}
                </Text>
              )}
              {location.ward && (
                <Text>
                  <strong>Phường/Xã:</strong> {location.ward}
                </Text>
              )}
              {location.district && (
                <Text>
                  <strong>Quận/Huyện:</strong> {location.district}
                </Text>
              )}
              {location.province && (
                <Text>
                  <strong>Tỉnh/TP:</strong> {location.province}
                </Text>
              )}
              {!location.street &&
                !location.ward &&
                !location.district &&
                !location.province && (
                  <Text color={mutedText}>Chưa cập nhật địa chỉ</Text>
                )}
            </VStack>
          </Box>

          <Divider />

          {/* Nút hành động */}
          <HStack spacing={3} mt={4}>
            <Button
              flex={1}
              leftIcon={<PhoneIcon />}
              colorScheme="teal"
              size="lg"
              onClick={() => alert("Liên hệ chủ kho...")}
              _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
            >
              Liên hệ
            </Button>

            {warehouse.isRenting ? (
              <Button
                flex={1}
                colorScheme="red"
                variant="solid"
                size="lg"
                fontWeight="bold"
                isDisabled
              >
                Đã được thuê
              </Button>
            ) : (
              <Button
                flex={1}
                colorScheme="orange"
                size="lg"
                fontWeight="bold"
                onClick={onOpen}
                _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
              >
                Thuê ngay
              </Button>
            )}
          </HStack>
        </VStack>
      </Grid>

      <RentWarehouseModal
        isOpen={isOpen}
        onClose={onClose}
        warehouseRef={warehouse._id}
        warehouseId={parseInt(warehouse.warehouseId)}
        pricePerDayWei={warehouse.pricePerDayWei}
        depositWei={warehouse.depositWei}
        ownerWallet={warehouse.ownerWallet}
      />
    </Box>
  );
}
