import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  HStack,
  IconButton,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  const bg = useColorModeValue("#f8fafc", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("blue.600", "blue.300");

  return (
    <Box bg={bg} borderTop="1px solid" borderColor={borderColor} mt={16}>
      <Container maxW="1200px" py={10}>
        {/* Nội dung chính */}
        <Stack
          direction={["column", "row"]}
          justify="space-between"
          align={["flex-start", "center"]}
          spacing={8}
        >
          {/* Logo và mô tả */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" color={brandColor}>
              SmartWarehouse
            </Text>
            <Text fontSize="sm" color={textColor} maxW="320px" mt={2}>
              Giải pháp chia sẻ và quản lý kho bãi thông minh — kết nối người có
              không gian trống với doanh nghiệp có nhu cầu lưu trữ.
            </Text>
          </Box>

          {/* Liên kết nhanh */}
          <HStack spacing={[4, 6]} fontSize="sm">
            <Link href="/">Trang chủ</Link>
            <Link href="/warehouses">Kho hàng</Link>
            <Link href="/blogs">Tin tức</Link>
            <Link href="/contact">Liên hệ</Link>
            <Link href="/my-warehouses">Kho hàng của tôi</Link>
          </HStack>

          {/* Mạng xã hội */}
          <HStack spacing={3}>
            <IconButton
              as="a"
              href="#"
              aria-label="Facebook"
              icon={<FaFacebook />}
              variant="ghost"
              colorScheme="facebook"
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Instagram"
              icon={<FaInstagram />}
              variant="ghost"
              colorScheme="pink"
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Twitter"
              icon={<FaTwitter />}
              variant="ghost"
              colorScheme="twitter"
            />
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub />}
              variant="ghost"
              colorScheme="gray"
            />
          </HStack>
        </Stack>

        {/* Đường gạch và bản quyền */}
        <Divider my={6} borderColor={borderColor} />
        <Text fontSize="sm" color={textColor} textAlign="center">
          © {new Date().getFullYear()} SmartWarehouse. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
