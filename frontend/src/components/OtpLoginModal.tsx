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
import { sendLoginOtp, verifyLoginOtp } from "../services/otpService";

export default function OtpLoginModal({
  isOpen,
  onClose,
  onSuccess,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email: string;
}) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const res = await sendLoginOtp(email);
      setMessage("📨 OTP đã được gửi tới email của bạn.");
      setCountdown(res.expireIn || 60);
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
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const res = await verifyLoginOtp(email, otp);
      setMessage(`✅ ${res.message}`);
      setOtp("");
      setTimeout(() => {
        onClose();
        onSuccess(); // refresh session
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || "❌ Mã OTP không chính xác hoặc đã hết hạn");
      setOtp("");
    } finally {
      setLoading(false);
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
              Mã OTP đã được gửi tới <b>{email}</b>.
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
            isDisabled={otp.length !== 6}
            isLoading={loading}
          >
            Xác nhận
          </Button>
          <Button
            variant="outline"
            onClick={handleSendOtp}
            isDisabled={countdown > 0}
          >
            {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại mã OTP"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
