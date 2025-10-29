import { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useWalletStore } from "../stores/walletStore";

export default function WalletConnectButton() {
  const {
    address,
    isUnlocked,
    isConnecting,
    error,
    connectWallet, // Chỉ dùng hàm này
  } = useWalletStore();

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Box>
      {address ? (
        /* ĐÃ KẾT NỐI */
        <HStack
          bg="blue.50"
          color="blue.600"
          p={3}
          borderRadius="lg"
          border="1px solid"
          borderColor="blue.200"
          spacing={2}
          fontSize="sm"
        >
          <Box w={4} h={4} bg="blue.500" borderRadius="full" />
          <Text fontWeight="medium">
            Đã kết nối: <strong>{formatAddress(address)}</strong>
          </Text>
        </HStack>
      ) : (
        /* CHƯA KẾT NỐI */
        <VStack spacing={3} align="stretch">
          {/* NÚT CHỈ GỌI KHI BẤM */}
          <Button
            onClick={connectWallet} // ← Chỉ gọi khi bấm
            isLoading={isConnecting}
            loadingText="Đang kết nối..."
            colorScheme={isUnlocked ? "orange" : "gray"}
            size="md"
            leftIcon={
              isConnecting ? (
                <Spinner size="sm" />
              ) : isUnlocked ? (
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  boxSize="18px"
                />
              ) : undefined
            }
          >
            {isUnlocked ? "Đăng nhập bằng MetaMask" : "Mở MetaMask để tiếp tục"}
          </Button>

          {/* Hướng dẫn nếu ví khóa */}
          {!isUnlocked && !isConnecting && (
            <Alert status="warning" borderRadius="md" fontSize="sm" p={3}>
              <AlertIcon />
              <AlertDescription>
                <VStack align="start" spacing={1}>
                  <Text fontSize="13px">
                    Vui lòng <strong>mở MetaMask</strong> và{" "}
                    <strong>nhập mật khẩu</strong>
                  </Text>
                  <HStack fontSize="12px" color="gray.600">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      boxSize="20px"
                    />
                    <Text>Click biểu tượng trên thanh công cụ</Text>
                  </HStack>
                </VStack>
              </AlertDescription>
            </Alert>
          )}

          {/* Lỗi */}
          {error && !error.includes("mở MetaMask") && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </VStack>
      )}
    </Box>
  );
}
