import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function TermsModal({ isOpen, onClose, onAgree }: TermsModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 5) {
      setScrolledToEnd(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Điều lệ & Chính sách</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          ref={contentRef}
          onScroll={handleScroll}
          maxH="400px"
          overflowY="auto"
          border="1px solid"
          borderColor="gray.200"
          p={4}
        >
          <VStack spacing={4} align="start">
            <Text fontWeight="bold" fontSize="lg">
              Điều lệ & Chính sách sử dụng
            </Text>

            <Text fontWeight="semibold">1. Quyền lợi của người dùng</Text>
            <Text>
              - Được sử dụng các tính năng cơ bản của website một cách hợp pháp.
              <br />
              - Được bảo vệ thông tin cá nhân theo chính sách bảo mật của chúng
              tôi.
              <br />- Được hỗ trợ khi gặp sự cố trong quá trình sử dụng.
            </Text>

            <Text fontWeight="semibold">2. Nghĩa vụ của người dùng</Text>
            <Text>
              - Cung cấp thông tin chính xác khi đăng ký tài khoản.
              <br />
              - Không chia sẻ tài khoản hoặc lạm dụng hệ thống.
              <br />- Tuân thủ mọi quy định, điều lệ, và luật pháp liên quan.
            </Text>

            <Text fontWeight="semibold">3. Bảo mật thông tin</Text>
            <Text>
              - Mọi thông tin cá nhân được chúng tôi bảo mật và chỉ dùng cho mục
              đích quản lý tài khoản.
              <br />
              - Không chia sẻ thông tin cá nhân cho bên thứ ba mà không có sự
              đồng ý của người dùng.
              <br />- Người dùng có trách nhiệm bảo vệ mật khẩu và thông tin
              đăng nhập.
            </Text>

            <Text fontWeight="semibold">4. Điều kiện sử dụng</Text>
            <Text>
              - Người dùng từ 18 tuổi trở lên mới được phép đăng ký.
              <br />
              - Mọi hành vi gian lận, spam, hoặc phá hoại hệ thống sẽ bị khóa
              tài khoản.
              <br />- Chúng tôi có quyền thay đổi điều lệ & chính sách bất cứ
              lúc nào và thông báo trên website.
            </Text>

            <Text fontStyle="italic" color="gray.600">
              Bằng việc đọc và đồng ý điều lệ & chính sách này, bạn xác nhận
              rằng bạn đã hiểu và đồng ý tuân thủ tất cả các quy định.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={() => {
              onAgree();
              onClose();
            }}
            isDisabled={!scrolledToEnd}
          >
            Tôi đã đọc
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
