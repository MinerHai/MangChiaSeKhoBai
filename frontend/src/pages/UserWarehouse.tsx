import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Heading,
  Button,
} from "@chakra-ui/react";

import { useState } from "react";
import WarehouseCard from "../components/warehouse/WarehouseCard";
import { useAuth } from "../stores/useAuthStore";
import { useWarehouse } from "../hooks/useWarehouse";
import type { Warehouse } from "../services/warehouseService";
import { Link as RouterLink } from "react-router-dom";
export default function UserWarehouse() {
  const [page, setPage] = useState(1);
  const { user } = useAuth(); // zustand store
  const { data, isLoading, isError, refetch, isFetching } = useWarehouse({
    ownerUserId: user?._id,
    page,
    limit: 4,
    enabled: !!user,
  });
  // Khi đang loading
  if (isLoading || isFetching)
    return (
      <Center h="80vh">
        <Spinner size="xl" />
      </Center>
    );

  // Khi lỗi
  if (isError)
    return (
      <Center h="80vh" flexDir="column">
        <Text mb={4}>Không thể tải danh sách kho hàng.</Text>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </Center>
    );

  // Khi có dữ liệu
  return (
    <Box p={6}>
      <Heading mb={6} fontSize="2xl">
        Danh sách kho hàng của bạn
      </Heading>
      <Button
        as={RouterLink} // Dùng React Router link
        to="/user/warehouses/add" // Đường dẫn cần đến
        colorScheme="teal"
        size="md"
        fontWeight="semibold"
        _hover={{ bg: "teal.500" }}
      >
        Đăng ký kho
      </Button>
      {data?.items?.length === 0 ? (
        <Center h="60vh">
          <Text fontSize="lg" color="gray.500">
            Bạn chưa có kho hàng nào.
          </Text>
        </Center>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {data?.items.map((wh: Warehouse) => (
              <WarehouseCard key={wh.warehouseId} warehouse={wh} />
            ))}
          </SimpleGrid>

          <Center mt={8}>
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              mr={3}
              isDisabled={page === 1}
            >
              Trang trước
            </Button>
            <Text fontWeight="medium">
              Trang {data?.page} / {data?.totalPages}
            </Text>
            <Button
              onClick={() =>
                setPage((p) => (p < (data?.totalPages || 1) ? p + 1 : p))
              }
              ml={3}
              isDisabled={page >= (data?.totalPages || 1)}
            >
              Trang sau
            </Button>
          </Center>
        </>
      )}
    </Box>
  );
}
