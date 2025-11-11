import { Box, Heading, Spinner, useToast } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogDetail, useUpdateBlog } from "../../hooks/useBlogs";
import BlogForm from "../../components/Form/BlogForm";
import { ROUTES } from "../../router";

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading } = useBlogDetail(id!);
  const { mutateAsync, isPending } = useUpdateBlog();
  const toast = useToast();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );

  if (!blog)
    return (
      <Box textAlign="center" py={20}>
        <Heading size="md">Không tìm thấy bài viết</Heading>
      </Box>
    );

  const handleSubmit = async (form: any) => {
    try {
      await mutateAsync({ id: blog._id, payload: form });
      toast({
        title: "Cập nhật bài viết thành công ✅",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(ROUTES.BLOG_DETAIL(blog._id));
    } catch (err: any) {
      toast({
        title: "Lỗi cập nhật bài viết",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="900px" mx="auto" py={10}>
      <Heading mb={6}>✏️ Chỉnh sửa bài viết</Heading>
      <BlogForm
        initialData={blog}
        onSubmit={handleSubmit}
        loading={isPending}
        buttonText="Lưu thay đổi"
      />
    </Box>
  );
}
