import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import HomeHero from "../components/homepage/HomeHero";
import Features from "../components/warehouse/Features";
import NewsSection from "../components/warehouse/NewsSection";
import { fetchWarehouses } from "../services/warehouseService";

const Homepage = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue("gray.50", "gray.800");

  const { data } = useQuery({
    queryKey: ["warehouses", "featured"],
    queryFn: () => fetchWarehouses({ limit: 3 }),
  });

  return (
    <Box py={16} bg={bg} minH="100vh">
      {/* HERO */}
      <HomeHero></HomeHero>
      {/* FEATURES */}
      <Features />

      {/* FEATURED WAREHOUSES */}
      <Box py={20} bg={useColorModeValue("gray.100", "gray.800")}>
        <Container maxW="6xl">
          <Heading size="lg" mb={8} textAlign="center">
            Kho nổi bật
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {data?.items?.map((w) => (
              <VStack
                key={w._id}
                bg="white"
                borderRadius="xl"
                shadow="md"
                overflow="hidden"
                align="stretch"
                onClick={() => navigate(`/warehouses/${w._id}`)}
                cursor="pointer"
                _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
              >
                <Image
                  src={
                    w.images?.[0]?.secure_url ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={w.name}
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Heading fontSize="lg">{w.name}</Heading>
                  <Text color="gray.600">
                    {w.location?.district}, {w.location?.province}
                  </Text>
                  <Text mt={2} color="orange.500" fontWeight="bold">
                    {(parseFloat(w.pricePerDayWei) / 1e18).toFixed(4)} ETH /
                    ngày
                  </Text>
                </Box>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <NewsSection />
      {/* CTA SECTION */}
      <Box
        py={20}
        bg={useColorModeValue("orange.500", "orange.400")}
        color="white"
        textAlign="center"
      >
        <Container maxW="5xl">
          <Heading mb={4}>Bắt đầu chia sẻ kho bãi ngay hôm nay</Heading>
          <Text mb={8}>
            Tham gia nền tảng để tận dụng không gian trống và tăng thu nhập.
          </Text>
          <Button
            size="lg"
            colorScheme="whiteAlpha"
            onClick={() => navigate("/my-warehouses")}
          >
            Đăng kho của tôi
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Homepage;
