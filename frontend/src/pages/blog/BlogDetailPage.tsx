import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  Spinner,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogDetail, useDeleteBlog } from "../../hooks/useBlogs";
import { useAuth } from "../../stores/useAuthStore";
import { ROUTES } from "../../router";
import { useRef } from "react";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading } = useBlogDetail(id!);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const textColor = useColorModeValue("gray.700", "gray.300");
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("blue.700", "blue.300");

  const toast = useToast();
  const { mutate: deleteBlog, isPending } = useDeleteBlog();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleConfirmDelete = () => {
    deleteBlog(blog._id, {
      onSuccess: () => {
        toast({
          title: "Đã xóa bài viết",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
        navigate(ROUTES.BLOG);
      },
      onError: (error) => {
        toast({
          title: "Lỗi khi xóa bài viết",
          description: error?.message || "Vui lòng thử lại sau",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };
  if (isLoading) {
    return (
      <Box py={20} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box py={20} textAlign="center">
        <Text>Không tìm thấy bài viết.</Text>
      </Box>
    );
  }

  const authorName =
    typeof blog.author === "object"
      ? blog.author?.username || blog.author?.email || "Ẩn danh"
      : blog.author || "Ẩn danh";

  return (
    <Box
      maxW="900px"
      mx="auto"
      py={10}
      px={4}
      bg={bg}
      rounded="lg"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      {/* Ảnh bìa */}
      {blog.coverImage?.secure_url && (
        <Image
          src={blog.coverImage.secure_url}
          alt={blog.title}
          rounded="xl"
          mb={6}
          w="100%"
          maxH="400px"
          objectFit="cover"
          shadow="md"
        />
      )}

      {/* Tiêu đề */}
      <Heading as="h1" mb={3} color={titleColor}>
        {blog.title}
      </Heading>

      {/* Tác giả + Category */}
      <HStack mb={2} spacing={4} flexWrap="wrap">
        <Text fontWeight="semibold" color="blue.500">
          {authorName}
        </Text>
        {blog.category && (
          <Tag colorScheme="purple" variant="solid">
            {blog.category.name}
          </Tag>
        )}
        <Text color="gray.500" fontSize="sm">
          🕓 {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
        </Text>
      </HStack>
      {user?.role === "admin" && (
        <>
          <HStack>
            <Button
              colorScheme="blue"
              onClick={() => navigate(ROUTES.BLOG_EDIT(blog._id))}
            >
              Edit
            </Button>
            <Button colorScheme="red" onClick={onOpen}>
              Delete
            </Button>
          </HStack>
          {/* Hộp thoại xác nhận xóa */}
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Xóa bài viết
                </AlertDialogHeader>

                <AlertDialogBody>
                  Bạn có chắc chắn muốn xóa bài viết này không? Hành động này
                  không thể hoàn tác.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Hủy
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleConfirmDelete}
                    ml={3}
                    isLoading={isPending}
                  >
                    Xóa
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}

      <Divider my={4} borderColor={borderColor} />

      {/* Nội dung HTML */}
      <Box
        mt={6}
        className="blog-content"
        color={textColor}
        lineHeight="tall"
        fontSize="lg"
        sx={{
          h1: { fontSize: "2xl", fontWeight: "bold", mb: 4 },
          h2: { fontSize: "xl", fontWeight: "semibold", mb: 3 },
          p: { mb: 3 },
          img: {
            borderRadius: "md",
            my: 4,
            boxShadow: "md",
          },
          a: {
            color: "blue.400",
            textDecoration: "underline",
          },
          ul: { pl: 6, mb: 3, listStyleType: "disc" },
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.content),
        }}
      />

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <HStack mt={8} spacing={3} flexWrap="wrap">
          {blog.tags.map((tag: string, i: number) => (
            <Tag key={i} colorScheme="blue" variant="subtle">
              #{tag}
            </Tag>
          ))}
        </HStack>
      )}
    </Box>
  );
}
