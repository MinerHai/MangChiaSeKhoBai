import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { rentWarehouseOnChain } from "../services/blockchainService";
import { rentWarehouseOnBackend } from "../services/rentalService";
import { useWalletStore } from "../stores/walletStore";

interface RentWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseRef: string;
  warehouseId: number;
  pricePerDayWei: string;
  depositWei: string;
  ownerWallet: string;
}

export default function RentWarehouseModal({
  isOpen,
  onClose,
  warehouseId,
  pricePerDayWei,
  depositWei,
  ownerWallet,
  warehouseRef,
}: RentWarehouseModalProps) {
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { address, connectWallet, isConnecting } = useWalletStore();

  const totalEth =
    (Number(pricePerDayWei) * days) / 1e18 + Number(depositWei) / 1e18;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (!address) {
        await connectWallet();
        return;
      }

      if (!(window as any).ethereum)
        throw new Error("Vui lòng cài đặt MetaMask để tiếp tục");

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const chainId = (await provider.getNetwork()).chainId;

      // ✅ Gọi on-chain
      const { txHash, blockNumber, totalPriceWei } = await rentWarehouseOnChain(
        provider,
        warehouseId,
        days,
        pricePerDayWei,
        depositWei
      );

      // ✅ Lưu backend
      const start = new Date();
      const end = new Date(start);
      end.setDate(start.getDate() + days);

      await rentWarehouseOnBackend({
        warehouseRef: warehouseRef,
        warehouseId: String(warehouseId),
        renterWallet: address,
        ownerWallet,
        pricePaidWei: totalPriceWei,
        depositWei,
        durationDays: days,
        txHash,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        blockNumber,
        chainId,
      });

      toast({
        title: "Thuê kho thành công!",
        description: "Giao dịch đã được ghi nhận trên blockchain.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Lỗi khi thuê kho",
        description: err.message || "Không thể thực hiện giao dịch",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thuê kho #{warehouseId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <FormLabel>Số ngày thuê</FormLabel>
              <Input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </FormControl>
            <Text>
              💰 Tổng tiền: <b>{totalEth.toFixed(4)} ETH</b>
            </Text>

            {!address ? (
              <Button
                onClick={connectWallet}
                colorScheme="orange"
                leftIcon={isConnecting ? <Spinner size="sm" /> : undefined}
                isDisabled={isConnecting}
              >
                {isConnecting ? "Đang kết nối ví..." : "Kết nối MetaMask"}
              </Button>
            ) : (
              <Text> Address: {address}</Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="orange"
            onClick={handleConfirm}
            isLoading={loading}
            isDisabled={!address}
          >
            Xác nhận thuê
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
