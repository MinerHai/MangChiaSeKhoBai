import { useEffect, useRef, useState } from "react";
import {
  Spinner,
  Center,
  Box,
  Text,
  VStack,
  Tooltip,
  useColorModeValue,
  Avatar,
  Input,
  Heading,
  Flex,
  Divider,
  useToast,
  Button,
  useDisclosure,
  Link,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  Modal,
  ModalOverlay,
  ModalHeader,
} from "@chakra-ui/react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../stores/useAuthStore";
import { changeAvatar } from "../services/authService";
import OtpModal from "../components/OtpModal";
import { useSendOtp } from "../hooks/useOtp";
import ColorModeSwitch from "../components/ColorModeSwitch";
import RoleRequestForm from "../components/Form/RoleRequest";
import ChangePasswordForm from "../components/Form/ChangePassword";
import { ROUTES } from "../router";
import { useNavigate } from "react-router-dom";
import TwoFactorToggle from "../components/TwoFactorToggle";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useUserProfile();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendOtp, isPending } = useSendOtp();
  const toast = useToast();
  // OTP Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Change password modal
  const {
    isOpen: isChangePwOpen,
    onOpen: onChangePwOpen,
    onClose: onChangePwClose,
  } = useDisclosure();
  useEffect(() => {
    if (data?.user) setUser(data.user);
  }, [data, setUser]);

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (error) return <Text>Error loading profile</Text>;
  if (!user) return <Text>No user data found</Text>;

  const bg = useColorModeValue("gray.50", "gray.800");

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  // Upload avatar
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await changeAvatar(file);

      if (res.user) {
        setUser(res.user);
      } else if (res.avatarUrl) {
        setUser({
          ...user,
          avatar: {
            secure_url: res.user.secure_url,
            public_id: res.user.public_id,
          },
        });
      }
      toast({
        title: "Cập nhật ảnh đại diện thành công!",
        status: "success",
        duration: 2000,
      });
      refetch();
    } catch (err) {
      toast({
        title: "Upload thất bại",
        status: "error",
        duration: 2000,
      });
    } finally {
      setUploading(false);
    }
  };
  // Send OTP to verify account
  const handleOpenOtp = () => {
    onOpen();
    sendOtp(undefined, {
      onSuccess: () => {
        toast({
          title: "Đã gửi mã OTP",
          description: "Vui lòng kiểm tra email của bạn",
          status: "success",
          duration: 3000,
        });
      },
      onError: () => {
        toast({
          title: "Gửi OTP thất bại",
          description: "Vui lòng thử lại sau ít phút",
          status: "error",
          duration: 3000,
        });
        onClose();
      },
    });
  };
  return (
    <Box minH="100vh" bg={bg} py={10} px={{ base: 4, md: 16 }}>
      <Button mb={4} onClick={() => navigate(-1)}>
        ← Quay lại
      </Button>
      <VStack align="center" spacing={8}>
        {/* Avatar */}
        <Tooltip label="Click để đổi ảnh đại diện" hasArrow>
          <Box
            position="relative"
            onClick={handleAvatarClick}
            _hover={{
              cursor: "pointer",
              transform: "scale(1.03)",
              transition: "0.2s",
            }}
          >
            <Avatar
              size="2xl"
              name={user.username}
              src={user.avatar?.secure_url || ""}
              border="3px solid"
              borderColor="teal.400"
            />
            {uploading && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0,0,0,0.5)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
              >
                <Spinner color="white" />
              </Box>
            )}
          </Box>
        </Tooltip>

        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          display="none"
        />

        <Heading size="lg">{user.username}</Heading>
      </VStack>

      {/* Divider */}
      <Divider my={10} />

      {/* Info Section */}
      <Box maxW="800px" mx="auto">
        <VStack align="stretch" spacing={6}>
          {/* Email */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Email</Text>
            <Text>{user.email}</Text>
          </Flex>

          {/* Status */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Trạng thái</Text>
            <Text color={user.isActive ? "green.500" : "red.400"}>
              {user.isActive ? (
                "Đã xác thực"
              ) : (
                <Button
                  colorScheme="teal"
                  onClick={handleOpenOtp}
                  isLoading={isPending}
                >
                  Xác thực tài khoản
                </Button>
              )}
            </Text>

            {/* Modal OTP */}
            <OtpModal isOpen={isOpen} onClose={onClose} onSuccess={refetch} />
          </Flex>

          {/* Role */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Vai trò</Text>
            <Text textTransform="capitalize">{user.role}</Text>
          </Flex>
          {/* User Warehouses */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Kho hàng của bạn</Text>
            {user.role === "owner" || user.role === "admin" ? (
              <Button
                as={Link}
                href={ROUTES.USER_WAREHOUSES}
                colorScheme="teal"
              >
                Xem kho hàng
              </Button>
            ) : (
              <RoleRequestForm></RoleRequestForm>
            )}
          </Flex>

          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Hợp đồng của bạn</Text>
            <Button as={Link} href={ROUTES.USER_CONTRACT} colorScheme="teal">
              Xem hợp đồng
            </Button>
          </Flex>

          {/* Color Mode Switch */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Mode</Text>
            <ColorModeSwitch />
          </Flex>

          {/* 2FA */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Xác thực 2 lớp</Text>
            <TwoFactorToggle />
          </Flex>
          {/* Change password */}
          <Flex
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={3}
          >
            <Text fontWeight="bold">Mật khẩu</Text>
            <Button colorScheme="teal" onClick={onChangePwOpen}>
              Đổi mật khẩu
            </Button>
          </Flex>

          {/* Modal đổi mật khẩu */}
          <Modal isOpen={isChangePwOpen} onClose={onChangePwClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Đổi mật khẩu</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <ChangePasswordForm onClose={onChangePwClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Box>
    </Box>
  );
}
