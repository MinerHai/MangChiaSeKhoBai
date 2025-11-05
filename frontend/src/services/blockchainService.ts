import { ethers } from "ethers";
import { getContract } from "../utils/etherProvider";

interface RegisterParams {
  warehouseId: number;
  pricePerDayWei: string;
  depositWei: string;
}
// create
export const registerWarehouseOnChain = async (
  provider: ethers.providers.Web3Provider,
  { warehouseId, pricePerDayWei, depositWei }: RegisterParams
) => {
  const contract = getContract(provider);
  const tx = await contract.registerWarehouse(
    warehouseId,
    ethers.BigNumber.from(pricePerDayWei || "0"),
    ethers.BigNumber.from(depositWei || "0")
  );
  const receipt = await tx.wait();
  return receipt;
};

//update
export const updateWarehouseOnChain = async (
  provider: ethers.providers.Web3Provider,
  warehouseId: string | number,
  pricePerDayWei: string,
  depositWei: string
): Promise<string> => {
  const contract = getContract(provider);
  console.log("updateWarehouseOnChain params:", {
    warehouseId,
    pricePerDayWei,
    depositWei,
  });

  // 🔹 Validate inputs
  const price =
    pricePerDayWei && !isNaN(Number(pricePerDayWei))
      ? ethers.BigNumber.from(pricePerDayWei)
      : ethers.BigNumber.from("0");

  const deposit =
    depositWei && !isNaN(Number(depositWei))
      ? ethers.BigNumber.from(depositWei)
      : ethers.BigNumber.from("0");

  const tx = await contract.registerWarehouse(
    Number(warehouseId),
    ethers.BigNumber.from(price.toString()),
    ethers.BigNumber.from(deposit.toString())
  );

  const receipt = await tx.wait();
  return receipt.transactionHash;
};

/**
 * 🔹 Gọi smart contract để thuê kho
 * (Frontend thực hiện giao dịch blockchain)
 */
export const rentWarehouseOnChain = async (
  provider: ethers.providers.Web3Provider,
  warehouseId: number,
  durationDays: number,
  pricePerDayWei: string,
  depositWei: string
): Promise<{
  txHash: string;
  blockNumber: number;
  totalPriceWei: string;
}> => {
  const contract = getContract(provider);

  const totalPriceWei = (
    BigInt(pricePerDayWei) * BigInt(durationDays)
  ).toString();

  // ✅ chỉ truyền 2 tham số như smart contract định nghĩa
  const tx = await contract.rent(warehouseId, durationDays, {
    value: ethers.BigNumber.from(totalPriceWei).add(
      ethers.BigNumber.from(depositWei)
    ),
  });

  const receipt = await tx.wait();

  return {
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    totalPriceWei,
  };
};
export const endLeaseOnChain = async (
  provider: ethers.providers.Web3Provider,
  warehouseId: number
): Promise<string> => {
  const contract = getContract(provider);
  const tx = await contract.endLease(warehouseId);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};
