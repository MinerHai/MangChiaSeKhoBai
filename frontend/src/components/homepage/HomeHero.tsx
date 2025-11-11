import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bgImg from "../../assets/bg.jpg";
export default function HomeHero() {
  const navigate = useNavigate();

  const overlayColor = useColorModeValue(
    "rgba(255, 255, 255, 0.75)",
    "rgba(0, 0, 0, 0.55)"
  );

  return (
    <Box
      position="relative"
      h={{ base: "80vh", md: "85vh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Image
        src={bgImg} // hoặc import ảnh bạn có
        alt="Warehouse background"
        position="absolute"
        inset={0}
        objectFit="cover"
        w="100%"
        h="100%"
        zIndex={0}
      />

      {/* 🔹 Overlay làm mờ nền */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, rgba(0,0,0,0.4), rgba(0,0,0,0.7))"
        zIndex={1}
      />

      {/* 🔹 Nội dung chính */}
      <Container maxW="6xl" zIndex={2} textAlign="center" color="white" px={6}>
        <VStack spacing={6}>
          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            Chia sẻ kho bãi <br /> thông minh, an toàn & minh bạch
          </Heading>

          <Text fontSize={{ base: "md", md: "xl" }} maxW="2xl">
            Nền tảng giúp bạn <b>tìm, thuê</b> hoặc <b>cho thuê kho</b> nhanh
            chóng. Giao dịch minh bạch với hợp đồng thông minh trên blockchain.
          </Text>

          <HStack spacing={4} mt={6}>
            <Button
              colorScheme="orange"
              size="lg"
              px={8}
              onClick={() => navigate("/warehouses")}
            >
              🔍 Tìm kho ngay
            </Button>
            <Button
              variant="outline"
              colorScheme="orange"
              size="lg"
              px={8}
              onClick={() => navigate("/my-warehouses")}
            >
              🏠 Đăng kho của bạn
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
