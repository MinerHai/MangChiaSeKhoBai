import {
  Flex,
  Switch,
  Text,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../stores/useAuthStore";
import { toggleTwoFactor } from "../services/authService";

export default function TwoFactorToggle() {
  const { user, restoreSession } = useAuth();
  const [password, setPassword] = useState("");
  const [targetState, setTargetState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  if (!user) return null;

  const handleToggle = (checked: boolean) => {
    setTargetState(checked);
    onOpen();
  };

  const handleConfirm = async () => {
    if (!user || targetState === null) return;
    try {
      setLoading(true);
      const res = await toggleTwoFactor(targetState, password);
      toast({
        title: res.message,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      await restoreSession();
    } catch (err: any) {
      toast({
        title: "Không thể thay đổi 2FA",
        description: err.message || "Mật khẩu không chính xác",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setPassword("");
      onClose();
    }
  };

  return (
    <>
      <Flex direction="column" align="flex-end">
        <Switch
          colorScheme="teal"
          size="md"
          ml={3}
          isChecked={user.isTwoFactorEnabled}
          onChange={(e) => handleToggle(e.target.checked)}
        />
      </Flex>

      {/* Modal nhập mật khẩu xác nhận */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận mật khẩu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3} fontSize="sm" color="gray.600">
              Nhập mật khẩu của bạn để <b>{targetState ? "bật" : "tắt"}</b> xác
              thực hai lớp.
            </Text>
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleConfirm}
              isLoading={loading}
              isDisabled={!password}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
