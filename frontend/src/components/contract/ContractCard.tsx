import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Link,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { endLease } from "../../services/endLeaseService";
import { useWalletStore } from "../../stores/walletStore";
import { formatVnd, getEthToVndRate, weiToEth } from "../../utils/ethCaculator";

interface Contract {
  _id: string;
  warehouseId: string;
  warehouseRef: string;
  renterWallet: string;
  ownerWallet: string;
  pricePaidWei: string;
  depositWei: string;
  durationDays: number;
  startTime: string;
  endTime: string;
  txHash: string;
  status: string;
  blockNumber: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  contract: Contract;
}

export default function ContractCard({ contract }: Props) {
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [ethToVnd, setEthToVnd] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { provider } = useWalletStore();
  const toast = useToast();

  useEffect(() => {
    getEthToVndRate().then(setEthToVnd);
  }, []);

  const pricePerDayEth =
    weiToEth(contract.pricePaidWei) / contract.durationDays;
  const totalEth = weiToEth(contract.pricePaidWei);
  const depositEth = weiToEth(contract.depositWei);

  const isEnded = contract.status?.toLowerCase() !== "active";
  const now = new Date();
  const endTime = new Date(contract.endTime);
  const canEnd = !isEnded && now >= endTime;

  const handleEndLease = async () => {
    if (!provider) {
      toast({
        title: "Lỗi",
        description:
          "Ví chưa được kết nối. Vui lòng kết nối ví trước khi kết thúc hợp đồng.",
        status: "error",
        duration: 4000,
      });
      return;
    }

    setIsProcessing(true);
    try {
      await endLease(
        provider,
        Number(contract.warehouseId),
        contract.txHash,
        toast,
        () => {
          toast({
            title: "Đã kết thúc hợp đồng",
            description: "Kho đã được mở lại để cho thuê.",
            status: "success",
            duration: 4000,
          });
        }
      );
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể kết thúc hợp đồng.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      bg={bgCard}
      border="1px solid"
      borderColor={borderColor}
      shadow="sm"
      borderRadius="xl"
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <CardHeader>
        <HStack justify="space-between">
          <Text fontWeight="bold">Kho #{contract.warehouseId}</Text>
          <Badge colorScheme={isEnded ? "gray" : "green"} variant="subtle">
            {isEnded ? "Đã kết thúc" : "Đang hoạt động"}
          </Badge>
        </HStack>
      </CardHeader>

      <Divider />

      <CardBody>
        <VStack align="start" spacing={2} fontSize="sm">
          <Text>
            🧑‍💼 Chủ kho:{" "}
            <b>
              {contract.ownerWallet
                ? `${contract.ownerWallet.slice(
                    0,
                    6
                  )}...${contract.ownerWallet.slice(-4)}`
                : "Không rõ"}
            </b>
          </Text>
          <Text>
            🤝 Người thuê:{" "}
            <b>
              {contract.renterWallet
                ? `${contract.renterWallet.slice(
                    0,
                    6
                  )}...${contract.renterWallet.slice(-4)}`
                : "Không rõ"}
            </b>
          </Text>
          <Text>
            ⏱ Thời gian thuê:{" "}
            <b>
              {new Date(contract.startTime).toLocaleDateString()} →{" "}
              {new Date(contract.endTime).toLocaleDateString()}
            </b>
          </Text>

          {/* 💰 Giá thuê */}
          <Text>
            💰 Giá mỗi ngày: <b>{pricePerDayEth.toFixed(6)} ETH</b>
            {ethToVnd ? (
              <Text as="span" color="gray.500">
                {" "}
                ({formatVnd(pricePerDayEth * ethToVnd)})
              </Text>
            ) : (
              <Spinner size="xs" ml={2} />
            )}
          </Text>

          <Text>
            💎 Tổng tiền thuê: <b>{totalEth.toFixed(6)} ETH</b>
            {ethToVnd ? (
              <Text as="span" color="gray.500">
                {" "}
                ({formatVnd(totalEth * ethToVnd)})
              </Text>
            ) : (
              <Spinner size="xs" ml={2} />
            )}
          </Text>

          <Text>
            🔒 Đặt cọc: <b>{depositEth.toFixed(6)} ETH</b>
            {ethToVnd ? (
              <Text as="span" color="gray.500">
                {" "}
                ({formatVnd(depositEth * ethToVnd)})
              </Text>
            ) : (
              <Spinner size="xs" ml={2} />
            )}
          </Text>

          <Text>
            🔗 Giao dịch:{" "}
            <Link
              href={`https://volta-explorer.energyweb.org/tx/${contract.txHash}`}
              color="blue.400"
              isExternal
            >
              {contract.txHash.slice(0, 12)}...
            </Link>
          </Text>

          <Text>
            ⛓ Block: <b>{contract.blockNumber}</b>
          </Text>

          {/* 🔘 Nút kết thúc hợp đồng */}
          {canEnd && (
            <Button
              colorScheme="red"
              size="sm"
              mt={3}
              isLoading={isProcessing}
              onClick={handleEndLease}
            >
              Kết thúc hợp đồng
            </Button>
          )}
          {!canEnd && !isEnded && (
            <Button colorScheme="gray" size="sm" mt={3} disabled>
              Chưa đến hạn kết thúc
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
