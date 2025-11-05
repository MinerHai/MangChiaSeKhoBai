import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchContractsByWallet } from "../services/rentalService";
import { useWalletStore } from "../stores/walletStore";
import WalletConnectButton from "../components/WalletConnectButton";
import ContractCard from "../components/contract/ContractCard";

export default function ContractsPage() {
  const { address } = useWalletStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["contracts", address],
    queryFn: () => fetchContractsByWallet(address!),
    enabled: !!address, // chỉ fetch khi đã có ví
  });

  if (!address)
    return (
      <Box textAlign="center" mt={10}>
        <Text>⚠️ Vui lòng kết nối ví MetaMask để xem hợp đồng của bạn.</Text>
        <WalletConnectButton />
      </Box>
    );

  if (isLoading)
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
        <Text mt={3}>Đang tải danh sách hợp đồng...</Text>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500">
          Lỗi tải dữ liệu: {(error as any).message || "Không xác định"}
        </Text>
      </Box>
    );

  // ✅ API trả về { success: true, data: [...] }
  const contracts = data?.data || [];

  const renterContracts = contracts.filter(
    (c: any) => c.renterWallet?.toLowerCase() === address?.toLowerCase()
  );

  const ownerContracts = contracts.filter(
    (c: any) => c.ownerWallet?.toLowerCase() === address?.toLowerCase()
  );

  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      <Heading size="lg" mb={6} textAlign="center">
        Quản lý hợp đồng của bạn
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="orange" isFitted>
        <TabList mb="1em">
          <Tab>🟢 Hợp đồng đang thuê</Tab>
          <Tab>🟠 Hợp đồng cho thuê</Tab>
        </TabList>

        <TabPanels>
          {/* --- Hợp đồng đang thuê --- */}
          <TabPanel>
            {renterContracts.length > 0 ? (
              <VStack align="stretch" spacing={4}>
                {renterContracts.map((c: any) => (
                  <ContractCard key={c._id} contract={c} />
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" color="gray.500">
                Bạn chưa thuê kho nào.
              </Text>
            )}
          </TabPanel>

          {/* --- Hợp đồng cho thuê --- */}
          <TabPanel>
            {ownerContracts.length > 0 ? (
              <VStack align="stretch" spacing={4}>
                {ownerContracts.map((c: any) => (
                  <ContractCard key={c._id} contract={c} />
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" color="gray.500">
                Bạn chưa cho thuê kho nào.
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
