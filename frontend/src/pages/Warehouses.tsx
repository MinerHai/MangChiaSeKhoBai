import {
  Box,
  Input,
  SimpleGrid,
  Spinner,
  Center,
  Heading,
  Button,
  Flex,
  Text,
  NumberInput,
  NumberInputField,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import WarehouseCard from "../components/warehouse/WarehouseCard";
import { useWarehouse } from "../hooks/useWarehouse";
import type { Warehouse } from "../services/warehouseService";
import {
  LocationDropdown,
  type LocationData,
} from "../components/LocationDropdown";

export default function WarehousesPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    keyword: "",
    minCapacity: undefined as number | undefined,
    maxCapacity: undefined as number | undefined,
    minPriceWei: undefined as string | undefined,
    maxPriceWei: undefined as string | undefined,
  });

  const [location, setLocation] = useState<LocationData>({
    province: "",
    district: "",
    ward: "",
  });

  const { data, isLoading, isError, refetch, isFetching } = useWarehouse({
    ...filters,
    province: location.province,
    district: location.district,
    ward: location.ward,
  });

  const handleChange = (field: any, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const bgFilter = useColorModeValue("gray.50", "gray.700");

  return (
    <Box p={6}>
      <Heading mb={6} fontSize="2xl" textAlign="center">
        Danh sách kho hàng
      </Heading>

      <Box
        p={5}
        mb={6}
        rounded="xl"
        bg={bgFilter}
        shadow="sm"
        borderWidth="1px"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align="center"
          justify="space-between"
          flexWrap="wrap"
        >
          <Input
            placeholder="🔍 Tìm theo tên hoặc mô tả"
            value={filters.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
            maxW={{ base: "100%", md: "250px" }}
          />

          <LocationDropdown
            value={location}
            onChange={setLocation}
            showLabels={false}
          />

          <HStack spacing={3}>
            <NumberInput
              value={filters.minCapacity || ""}
              onChange={(val) => handleChange("minCapacity", val)}
              maxW="120px"
            >
              <NumberInputField placeholder="Min m³" />
            </NumberInput>
            <NumberInput
              value={filters.maxCapacity || ""}
              onChange={(val) => handleChange("maxCapacity", val)}
              maxW="120px"
            >
              <NumberInputField placeholder="Max m³" />
            </NumberInput>
          </HStack>

          <HStack spacing={3}>
            <NumberInput
              value={filters.minPriceWei || ""}
              onChange={(val) => handleChange("minPriceWei", val)}
              maxW="120px"
            >
              <NumberInputField placeholder="Giá từ" />
            </NumberInput>
            <NumberInput
              value={filters.maxPriceWei || ""}
              onChange={(val) => handleChange("maxPriceWei", val)}
              maxW="120px"
            >
              <NumberInputField placeholder="Đến" />
            </NumberInput>
          </HStack>

          <Button colorScheme="teal" onClick={() => refetch()}>
            Lọc
          </Button>
        </Flex>
      </Box>

      {isLoading || isFetching ? (
        <Center h="60vh">
          <Spinner size="xl" />
        </Center>
      ) : isError ? (
        <Center flexDir="column" h="60vh">
          <Text mb={3}>Không thể tải danh sách kho hàng.</Text>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </Center>
      ) : data?.items?.length === 0 ? (
        <Center h="60vh">
          <Text fontSize="lg" color="gray.500">
            Không tìm thấy kho hàng nào.
          </Text>
        </Center>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {data.items.map((wh: Warehouse) => (
              <WarehouseCard key={wh._id} warehouse={wh} />
            ))}
          </SimpleGrid>

          <Center mt={8}>
            <Button
              onClick={() =>
                setFilters((f) => ({ ...f, page: Math.max(f.page - 1, 1) }))
              }
              mr={3}
              isDisabled={filters.page === 1}
            >
              Trang trước
            </Button>
            <Text fontWeight="medium">
              Trang {data?.page} / {data?.totalPages}
            </Text>
            <Button
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  page: f.page < (data?.totalPages || 1) ? f.page + 1 : f.page,
                }))
              }
              ml={3}
              isDisabled={filters.page >= (data?.totalPages || 1)}
            >
              Trang sau
            </Button>
          </Center>
        </>
      )}
    </Box>
  );
}
