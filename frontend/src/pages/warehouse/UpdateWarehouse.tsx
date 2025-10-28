import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useWalletStore } from "../../stores/walletStore";
import { LocationDropdown } from "../../components/LocationDropdown";
import {
  warehouseSchema,
  type RegisterWarehouseForm,
} from "../../schemas/warehouseSchema";
import { useQuery } from "@tanstack/react-query";
import {
  fetchWarehouseById,
  type Warehouse,
} from "../../services/warehouseService";
import { useUpdateWarehouse } from "../../hooks/useWarehouse";
import { ROUTES } from "../../router";
import FullScreenLoader from "../../components/FullScreenLoader";

export default function EditWarehouse() {
  const { id } = useParams<{ id: string }>();
  const { address, provider, connectWallet } = useWalletStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<Partial<RegisterWarehouseForm>>({});
  const [location, setLocation] = useState({
    province: "",
    district: "",
    ward: "",
  });
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  // Query lấy dữ liệu kho hiện tại
  const { data, isLoading, isError } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => fetchWarehouseById(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.data) {
      const wh = data.data;
      setWarehouse(wh);
      setForm({
        name: wh.name,
        street: wh.location?.street,
        capacity: wh.capacity,
        pricePerDayWei: String(wh.pricePerDayWei),
        depositWei: String(wh.depositWei),
        description: wh.description,
      });
      setLocation({
        province: wh.location?.province || "",
        district: wh.location?.district || "",
        ward: wh.location?.ward || "",
      });
    }
  }, [data]);
  // Mutation update
  const updateMutation = useUpdateWarehouse(provider!);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name ?? "",
        province: location.province ?? "",
        district: location.district ?? "",
        ward: location.ward ?? "",
        street: form.street ?? "",
        // ép kiểu về string để khớp schema
        capacity: form.capacity !== undefined ? String(form.capacity) : "",
        pricePerDayWei:
          form.pricePerDayWei !== undefined ? String(form.pricePerDayWei) : "",
        depositWei:
          form.depositWei !== undefined ? String(form.depositWei) : "",
        description: form.description ?? "",
      };
      const validData = warehouseSchema.parse(payload);

      if (!address || !provider) {
        await connectWallet();
        return;
      }

      toast({
        title: "Đang cập nhật kho...",
        status: "info",
        duration: 1500,
        position: "top-right",
      });

      await updateMutation.mutateAsync({
        _id: id,
        warehouseId: warehouse?.warehouseId!,
        name: validData.name,
        capacity: validData.capacity,
        pricePerDayWei: validData.pricePerDayWei,
        depositWei: validData.depositWei,
        description: validData.description,
        location: {
          province: validData.province,
          district: validData.district,
          ward: validData.ward,
          street: validData.street,
        },

        ownerWallet: address,
      });

      toast({
        title: "Cập nhật kho thành công!",
        status: "success",
        duration: 2000,
        position: "top-right",
      });

      navigate(ROUTES.WAREHOUSE_DETAIL(warehouse?._id!));
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Lỗi dữ liệu",
          description: err.issues[0]?.message,
          status: "warning",
          duration: 3000,
          position: "top-right",
        });
      } else {
        console.error(err);
        toast({
          title: "Cập nhật thất bại",
          description: err.message || "Vui lòng thử lại sau",
          status: "error",
          duration: 3000,
          position: "top-right",
        });
      }
    }
  };

  if (isLoading)
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text>Đang tải thông tin kho...</Text>
      </Box>
    );

  if (isError || !data?.data)
    return (
      <Box textAlign="center" mt={20}>
        <Text color="red.400">Không tìm thấy kho hàng.</Text>
      </Box>
    );

  return (
    <Box w="100%" maxW="800px" mx="auto" mt={10} p={4}>
      <Heading size="lg" mb={6}>
        Chỉnh sửa kho
      </Heading>

      <HStack>
        <Button onClick={() => navigate(-1)}>← Quay lại</Button>
        {!address ? (
          <Button
            colorScheme="gray"
            onClick={connectWallet}
            isDisabled={updateMutation.isPending}
          >
            Kết nối ví
          </Button>
        ) : (
          <Text fontSize="sm">
            🪙 Ví đang kết nối: <b>{address}</b>
          </Text>
        )}
      </HStack>

      <VStack spacing={5} align="stretch" mt={6}>
        <FormControl isRequired>
          <FormLabel>Tên kho</FormLabel>
          <Input name="name" value={form.name || ""} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Địa chỉ kho</FormLabel>
          <LocationDropdown value={location} onChange={setLocation} />
          <Input
            mt={3}
            name="street"
            value={form.street || ""}
            onChange={handleChange}
            placeholder="Đường / Số nhà"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Dung tích (m³)</FormLabel>
          <Input
            type="text"
            name="capacity"
            value={form.capacity || ""}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Giá thuê / ngày (wei)</FormLabel>
          <Input
            type="text"
            name="pricePerDayWei"
            value={form.pricePerDayWei || ""}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Tiền cọc (wei)</FormLabel>
          <Input
            type="text"
            name="depositWei"
            value={form.depositWei || ""}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Mô tả</FormLabel>
          <Textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={4}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={updateMutation.isPending}
          size="lg"
          alignSelf="flex-start"
        >
          {updateMutation.isPending ? (
            <FullScreenLoader message="Đang cập nhật..." />
          ) : null}
          {updateMutation.isPending ? "Đang cập nhật..." : "Lưu thay đổi"}
        </Button>
      </VStack>
    </Box>
  );
}
