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
