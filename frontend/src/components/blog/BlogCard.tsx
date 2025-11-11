import {
  Box,
  HStack,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import placeholder from "../../assets/placeholder.jpg";
import { ROUTES } from "../../router";

interface BlogCardProps {
  blog: any;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const titleColor = useColorModeValue("blue.700", "blue.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const metaColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700"); // ✅ đường kẻ sáng/tối phù hợp
  const navigate = useNavigate();
  return (
    <LinkBox
      as="article"
      bg={bg}
      rounded="lg"
      shadow="sm"
      transition="all 0.25s ease"
      _hover={{
        bg: hoverBg,
        shadow: "md",
        transform: "translateY(-3px)",
      }}
      borderBottom="2px solid"
      borderColor={borderColor}
      p={4}
      display="flex"
      alignItems="stretch"
      gap={5}
    >
      {/* Ảnh */}
      <Box flexShrink={0} w={["150px", "230px"]}>
        <Image
          src={blog.coverImage?.secure_url || placeholder}
          alt={blog.title}
          rounded="md"
          objectFit="cover"
          w="100%"
          h={["120px", "160px"]}
        />
      </Box>

      {/* Nội dung */}
      <VStack align="stretch" flex="1" spacing={2} justify="space-between">
        <Box>
          <Heading
            as="h3"
            size="md"
            color={titleColor}
            _hover={{ color: useColorModeValue("blue.500", "blue.400") }}
            mb={1}
          >
            <LinkOverlay onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}>
              {blog.title}
            </LinkOverlay>
          </Heading>

          <Text
            fontSize="sm"
            color={textColor}
            noOfLines={[2, 3]}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Box>

        <HStack justify="space-between" pt={2}>
          <Text fontSize="xs" color={metaColor}>
            🕓 {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
          </Text>
          <Text fontSize="xs" color="green.400" fontWeight="500">
            {blog.category?.name || "Chưa phân loại"}
          </Text>
        </HStack>
      </VStack>
    </LinkBox>
  );
}
