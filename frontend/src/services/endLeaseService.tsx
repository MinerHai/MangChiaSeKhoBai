import { endLeaseOnChain } from "./blockchainService";
import { markContractEnded } from "./rentalService";
import type { ethers } from "ethers";

export const endLease = async (
  provider: ethers.providers.Web3Provider,
  warehouseId: number,
  txHash: string,
  toast: any,
  onSuccess?: () => void
) => {
  try {
    toast({
      title: "Đang kết thúc hợp đồng...",
      status: "loading",
      duration: null,
    });

    // 1️⃣ Gọi on-chain
    const onChainTx = await endLeaseOnChain(provider, warehouseId);
    console.log("Blockchain TX:", onChainTx);

    // 2️⃣ Cập nhật backend
    await markContractEnded(txHash);

    toast.closeAll();
    toast({
      title: "Thành công!",
      description: "Hợp đồng đã kết thúc. Tiền cọc đã được hoàn.",
      status: "success",
      duration: 6000,
    });

    onSuccess?.();
  } catch (error: any) {
    toast.closeAll();
    toast({
      title: "Lỗi",
      description: error.message?.includes("Lease still active")
        ? "Hợp đồng chưa hết hạn!"
        : error.message || "Không thể kết thúc hợp đồng.",
      status: "error",
      duration: 8000,
    });
    console.error("End lease failed:", error);
  }
};
