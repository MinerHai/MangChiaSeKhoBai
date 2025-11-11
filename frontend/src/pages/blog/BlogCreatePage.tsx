import { useToast, Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCreateBlog } from "../../hooks/useBlogs";
import BlogForm from "../../components/Form/BlogForm";

export default function BlogCreatePage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateBlog();

  const handleSubmit = async (form: any) => {
    try {
      await mutateAsync(form);
      toast({
        title: "Tạo bài viết thành công 🎉",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/"); // hoặc navigate(`/blogs/${newBlog.slug}`) nếu API trả slug
    } catch (err: any) {
      toast({
        title: "Lỗi khi tạo bài viết",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="900px" mx="auto" py={10}>
      <Heading mb={6}>📝 Tạo bài viết mới</Heading>
      <BlogForm
        onSubmit={handleSubmit}
        loading={isPending}
        buttonText="Đăng bài"
      />
    </Box>
  );
}
