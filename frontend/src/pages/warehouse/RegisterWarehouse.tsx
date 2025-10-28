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
import React, { useState } from "react";
import { z } from "zod";
import { LocationDropdown } from "../../components/LocationDropdown";
import {
  warehouseSchema,
  type RegisterWarehouseForm,
} from "../../schemas/warehouseSchema";
import { registerWarehouseOnChain } from "../../services/blockchainService";
import { saveWarehouseToBackend } from "../../services/warehouseService";
import { useWalletStore } from "../../stores/walletStore";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";

export default function RegisterWarehouse() {
  const { address, provider, connectWallet } = useWalletStore();
  const navigate = useNavigate();
  const toast = useToast();
  // location
  const [location, setLocation] = useState({
    province: "",
    district: "",
    ward: "",
  });
  const [form, setForm] = useState<Partial<RegisterWarehouseForm>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate bằng Zod
      const validData = warehouseSchema.parse({
        ...form,
        ...location,
        imageFile,
      });

      if (!address || !provider) {
        await connectWallet();
        return;
      }

      setLoading(true);

      const warehouseId = Date.now(); // hoặc theo logic khác

      const receipt = await registerWarehouseOnChain(provider, {
        warehouseId,
        pricePerDayWei: validData.pricePerDayWei,
        depositWei: validData.depositWei,
      });

      // Gửi backend
      const backendPayload = {
        warehouseId: warehouseId.toString(),
        name: validData.name,
        location: {
          province: validData.province,
          district: validData.district,
          ward: validData.ward,
          street: validData.street,
        },
        capacity: validData.capacity,
        ownerWallet: address,
        pricePerDayWei: validData.pricePerDayWei,
        depositWei: validData.depositWei,
        description: validData.description || "",
        txHash: receipt.transactionHash,
        // images: sẽ xử lý file upload ở service
        imageFile: imageFile!,
      };

      await saveWarehouseToBackend(backendPayload);

      toast({
        title: "Đăng ký kho thành công!",
        status: "success",
        duration: 2000,
        position: "top-right",
      });

      // Reset form
      setForm({});
      setImageFile(null);
      setPreview(null);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const first = err.issues[0];
        toast({
          title: "Lỗi dữ liệu",
          description: first?.message,
          status: "warning",
          duration: 3000,
          position: "top-right",
        });
      } else {
        console.error(err);
        toast({
          title: "Đăng ký kho thất bại",
          description: err.message || "Vui lòng thử lại sau",
          status: "error",
          duration: 3000,
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="100%" maxW="800px" mx="auto" mt={10} p={4}>
      <Heading size="lg" mb={6}>
        Đăng ký kho mới
      </Heading>
      <HStack>
        <Button onClick={() => navigate(-1)}>← Quay lại</Button>
        {!address ? (
          <Button
            colorScheme="gray"
            onClick={connectWallet}
            isDisabled={loading}
          >
            Kết nối ví
          </Button>
        ) : (
          <Text fontSize="sm">
            🪙 Ví đang kết nối: <b>{address}</b>
          </Text>
        )}
      </HStack>

      <VStack spacing={5} align="stretch">
        <FormControl isRequired>
          <FormLabel>Tên kho</FormLabel>
          <Input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Nhập tên kho"
          />
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
            type="number"
            name="capacity"
            value={form.capacity || ""}
            onChange={handleChange}
            placeholder="VD: 500"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Giá thuê / ngày (wei)</FormLabel>
          <Input
            type="number"
            name="pricePerDayWei"
            value={form.pricePerDayWei || ""}
            onChange={handleChange}
            placeholder="VD: 1000000000000000000"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Tiền cọc (wei)</FormLabel>
          <Input
            type="number"
            name="depositWei"
            value={form.depositWei || ""}
            onChange={handleChange}
            placeholder="VD: 500000000000000000"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Mô tả</FormLabel>
          <Textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Mô tả chi tiết về kho ..."
            rows={4}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Ảnh kho</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <Image
              src={preview}
              alt="Warehouse preview"
              borderRadius="md"
              mt={3}
              maxH="250px"
              objectFit="cover"
            />
          )}
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={loading}
          size="lg"
          alignSelf="flex-start"
        >
          {loading ? <FullScreenLoader /> : null}
          {loading ? "Đang xử lý..." : "Đăng ký kho"}
        </Button>
      </VStack>
    </Box>
  );
}
