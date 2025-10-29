import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  SimpleGrid,
  VStack,
  useToast,
  IconButton,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  addWarehouseImages,
  deleteWarehouseImage,
  type WareHouseImage,
} from "../../services/warehouseService";

interface Props {
  warehouseId: string;
  initialImages?: WareHouseImage[];
}

export const WarehouseImagesUploader: React.FC<Props> = ({
  warehouseId,
  initialImages = [],
}) => {
  const [images, setImages] = useState<WareHouseImage[]>(initialImages);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Hiển thị preview tạm thời trước khi upload
  const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles(Array.from(files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);
    try {
      const uploaded = await addWarehouseImages(warehouseId, selectedFiles);
      setImages(uploaded);
      setSelectedFiles([]);
      toast({ title: "Upload thành công", status: "success", duration: 2000 });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Upload thất bại",
        description: err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (public_id: string) => {
    setLoading(true);
    try {
      console.log("public_id in uploader: ", public_id);
      const idOnly = public_id.split("/").pop(); // "xyz"
      console.log("public_id in uploader:", idOnly);
      const updated = await deleteWarehouseImage(warehouseId, idOnly!);
      setImages(updated);
      toast({ title: "Xóa ảnh thành công", status: "success", duration: 2000 });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Xóa thất bại",
        description: err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Hình ảnh kho hàng</Text>

      {/* Preview ảnh hiện có */}
      <SimpleGrid columns={[2, 3, 4]} spacing={4}>
        {images.map((img) => (
          <Box
            key={img.public_id}
            position="relative"
            borderRadius="md"
            overflow="hidden"
            border="1px solid #eee"
          >
            <Image src={img.secure_url} objectFit="cover" w="100%" h="120px" />
            <Flex
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              bg="rgba(0,0,0,0.4)"
              opacity={0}
              _hover={{ opacity: 1 }}
              align="center"
              justify="center"
              transition="0.2s"
            >
              <IconButton
                aria-label="Xóa"
                icon={<CloseIcon />}
                colorScheme="red"
                onClick={() => handleDelete(img.public_id)}
              />
            </Flex>
          </Box>
        ))}

        {/* Preview ảnh chưa upload */}
        {previewUrls.map((url, idx) => (
          <Box
            key={idx}
            position="relative"
            borderRadius="md"
            overflow="hidden"
            border="1px dashed #ccc"
          >
            <Image
              src={url}
              objectFit="cover"
              w="100%"
              h="120px"
              opacity={0.7}
            />
            <Flex
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              bg="rgba(0,0,0,0.2)"
              align="center"
              justify="center"
            >
              <Text color="white" fontSize="sm">
                Chưa upload
              </Text>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {/* Input chọn file */}
      <Flex gap={2} align="center">
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ flex: 1 }}
        />
        <Button
          colorScheme="blue"
          onClick={handleUpload}
          isDisabled={selectedFiles.length === 0 || loading}
        >
          {loading ? <Spinner size="sm" mr={2} /> : null} Upload
        </Button>
      </Flex>
    </VStack>
  );
};
