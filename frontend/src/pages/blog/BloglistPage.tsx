import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useBlogs } from "../../hooks/useBlogs";
import { useCategories } from "../../hooks/useCategories";
import { useBlogFilterStore } from "../../stores/blogStore";
import placeholder from "../../assets/placeholder.jpg";

import BlogCard from "../../components/blog/BlogCard";
import { ROUTES } from "../../router";
import { useNavigate } from "react-router-dom";

export default function BlogListPage() {
  const { search, category, setSearch, setCategory, page, setPage } =
    useBlogFilterStore();
  const { data, isLoading } = useBlogs({ search, category, page, limit: 4 });
  const { data: categories } = useCategories();

  const [searchValue, setSearchValue] = useState(search || "");

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("blue.700", "blue.300");
  const sidebarTitleColor = useColorModeValue("gray.700", "gray.100");
  const inputBg = useColorModeValue("white", "gray.700");

  const navigate = useNavigate();

  // Scroll lên đầu khi đổi trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (isLoading) return <Spinner mt={10} />;

  return (
    <Box maxW="1200px" mx="auto" mt={8} px={4}>
      {/* 🔍 Thanh tìm kiếm */}
      <Box
        bg={bg}
        p={4}
        rounded="md"
        shadow="sm"
        mb={8}
        borderWidth="1px"
        borderColor={borderColor}
        display="flex"
        flexDir={["column", "row"]}
        alignItems="center"
        gap={4}
      >
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            bg={inputBg}
            placeholder="Tìm kiếm bài viết..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(searchValue)}
          />
        </InputGroup>

        <Button colorScheme="blue" onClick={() => setSearch(searchValue)}>
          Tìm kiếm
        </Button>

        {search && (
          <IconButton
            aria-label="clear search"
            icon={<CloseIcon />}
            size="sm"
            onClick={() => {
              setSearch("");
              setSearchValue("");
            }}
          />
        )}
      </Box>

      <SimpleGrid columns={[1, null, 3]} spacing={8}>
        {/* 📰 Danh sách bài viết */}
        <Box gridColumn={["1 / -1", null, "1 / 3"]}>
          <VStack align="stretch" spacing={8}>
            {data?.blogs?.length ? (
              data.blogs.map((blog: any) => (
                <BlogCard key={blog._id} blog={blog} />
              ))
            ) : (
              <Text textAlign="center" color="gray.500">
                Không có bài viết nào.
              </Text>
            )}

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <HStack justify="center" spacing={2} mt={8} flexWrap="wrap">
                {/* Nút trang trước */}
                <Button
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  isDisabled={page <= 1}
                  variant="outline"
                >
                  « Trước
                </Button>

                {/* Hiển thị danh sách số trang */}
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      size="sm"
                      onClick={() => setPage(p)}
                      colorScheme={p === page ? "blue" : undefined}
                      variant={p === page ? "solid" : "outline"}
                      fontWeight={p === page ? "bold" : "normal"}
                      minW="36px"
                    >
                      {p}
                    </Button>
                  )
                )}

                {/* Nút trang sau */}
                <Button
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  isDisabled={page >= data.totalPages}
                  variant="outline"
                >
                  Sau »
                </Button>
              </HStack>
            )}
          </VStack>
        </Box>

        {/* 📚 Sidebar */}
        <Box>
          <Box
            bg={bg}
            p={4}
            rounded="md"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading
              as="h4"
              size="md"
              mb={3}
              color={sidebarTitleColor}
              borderLeft="4px solid #3182ce"
              pl={2}
            >
              Danh mục
            </Heading>
            <Select
              placeholder="Chọn danh mục"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || null)}
              mb={4}
              bg={inputBg}
            >
              {categories?.map((cat: any) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Divider mb={4} borderColor={borderColor} />

            <Heading
              as="h4"
              size="md"
              mb={3}
              color={sidebarTitleColor}
              borderLeft="4px solid #3182ce"
              pl={2}
            >
              Bài viết mới
            </Heading>
            <VStack align="stretch" spacing={3}>
              {data?.blogs?.slice(0, 5).map((blog: any) => (
                <HStack key={blog._id} spacing={3}>
                  <Image
                    src={blog.coverImage?.secure_url || placeholder}
                    alt={blog.title}
                    w="60px"
                    h="60px"
                    objectFit="cover"
                    rounded="md"
                  />
                  <Link onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}>
                    <Text
                      fontSize="sm"
                      noOfLines={2}
                      _hover={{ color: headingColor }}
                    >
                      {blog.title}
                    </Text>
                  </Link>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
