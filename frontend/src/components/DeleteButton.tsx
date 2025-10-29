import React, { useRef } from "react";
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

// Props cho component
interface DeleteButtonProps {
  onConfirm: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onConfirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Chakra UI v1: ref vẫn dùng HTMLButtonElement
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} color="white" bgColor={"red.500"}>
        Xóa
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể
              hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Hủy
              </Button>
              <Button color="red.500" onClick={handleDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteButton;
