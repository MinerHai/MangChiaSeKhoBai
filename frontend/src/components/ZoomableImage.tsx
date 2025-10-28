import {
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from "@chakra-ui/react";

export function ZoomableImage({ src, alt }: { src: string; alt?: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      {/* Ảnh thu nhỏ */}
      <Image
        src={src}
        alt={alt}
        boxSize="120px"
        objectFit="cover"
        borderRadius="md"
        cursor="pointer"
        onClick={onOpen}
        _hover={{
          transform: "scale(1.05)",
          transition: "all 0.2s ease-in-out",
        }}
      />

      {/* Modal xem ảnh lớn */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" zIndex={10} />
          <ModalBody p={0}>
            <Image
              src={src}
              alt={alt}
              width="100%"
              height="auto"
              borderRadius="md"
              objectFit="contain"
              bg="black"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
