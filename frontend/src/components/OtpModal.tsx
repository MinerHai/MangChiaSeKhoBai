import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  HStack,
  PinInput,
  PinInputField,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSendOtp, useVerifyOtp } from "../hooks/useOtp";

export default function OtpModal({
  isOpen,
  onSuccess,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const handleSendOtp = async () => {
    try {
      await sendOtpMutation.mutateAsync();
      setMessage("📨 Mã OTP đã được gửi! Vui lòng kiểm tra email của bạn.");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || "❌ Gửi OTP thất bại");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const data = await verifyOtpMutation.mutateAsync(otp);
      setMessage(`✅ ${data.message}!`);
      setOtp("");
      setTimeout(onClose, 1000);
      onSuccess(); // dùng để chạy hki otp đúng
    } catch (err: any) {
      if (err.response?.status === 400) {
        setMessage("❌ Mã OTP không chính xác hoặc đã hết hạn!");
      } else if (err.response?.status === 401) {
        setMessage("⚠️ Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      } else {
        setMessage("🚨 Lỗi không xác định, vui lòng thử lại sau!");
      }
      setOtp("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader textAlign="center">Nhập mã OTP</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={5}>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Vui lòng nhập 6 chữ số OTP được gửi đến email của bạn.
            </Text>

            <HStack justify="center">
              <PinInput otp size="lg" onChange={setOtp} value={otp}>
                {[...Array(6)].map((_, i) => (
                  <PinInputField key={i} />
                ))}
              </PinInput>
            </HStack>

            {message && (
              <Text
                fontWeight="medium"
                color={
                  message.startsWith("✅") || message.startsWith("📨")
                    ? "green.500"
                    : "red.500"
                }
              >
                {message}
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center" gap={3}>
          <Button
            colorScheme="teal"
            onClick={handleVerifyOtp}
            isLoading={verifyOtpMutation.isPending}
            isDisabled={otp.length !== 6}
          >
            Xác nhận
          </Button>

          <Button
            variant="outline"
            onClick={handleSendOtp}
            isLoading={sendOtpMutation.isPending}
            isDisabled={countdown > 0}
          >
            {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại mã OTP"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
