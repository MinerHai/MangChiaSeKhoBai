import { useNavigate } from "react-router-dom";
import { useLatestBlogs } from "../../hooks/useBlogs";
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  VStack,
  Image,
  Text,
  Link,
  Button,
} from "@chakra-ui/react";
import { ROUTES } from "../../router";

export default function NewsSection() {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("gray.50", "gray.700");

  const { data, isLoading } = useLatestBlogs();

  const blogs = data?.blogs || [];

  if (isLoading) return <Spinner mt={10} />;

  return (
    <Box py={20} bg={bg}>
      <Heading
        size="lg"
        mb={10}
        textAlign="center"
        position="relative"
        _after={{
          content: '""',
          display: "block",
          width: "80px",
          height: "3px",
          bg: "orange.400",
          mx: "auto",
          mt: "4",
          borderRadius: "md",
        }}
      >
        📰 Tin tức & Cập nhật mới nhất
      </Heading>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={8}
        maxW="6xl"
        mx="auto"
        px={4}
      >
        {blogs.map((news: any) => (
          <VStack
            key={news._id}
            bg={cardBg}
            borderRadius="xl"
            shadow="md"
            align="stretch"
            spacing={3}
            overflow="hidden"
            _hover={{ shadow: "xl", transform: "translateY(-5px)" }}
            transition="all 0.2s"
          >
            <Image
              src={
                news.coverImage?.secure_url ||
                "https://via.placeholder.com/400x200"
              }
              alt={news.title}
              h="180px"
              w="100%"
              objectFit="cover"
            />
            <Box p={4}>
              <Text color="gray.500" fontSize="sm" mb={1}>
                {new Date(news.createdAt).toLocaleDateString("vi-VN")}
              </Text>
              <Heading fontSize="lg" mb={2} noOfLines={2}>
                {news.title}
              </Heading>
              <Text color="gray.600" noOfLines={3}>
                {news.summary || "Không có mô tả."}
              </Text>
              <Link
                mt={3}
                display="inline-block"
                color="orange.500"
                fontWeight="bold"
                onClick={() => navigate(`/blogs/${news._id}`)}
              >
                Xem chi tiết →
              </Link>
            </Box>
          </VStack>
        ))}
      </SimpleGrid>

      <Box textAlign="center" mt={12}>
        <Button
          colorScheme="orange"
          variant="outline"
          onClick={() => navigate(ROUTES.BLOG)}
        >
          Xem tất cả tin tức
        </Button>
      </Box>
    </Box>
  );
}
