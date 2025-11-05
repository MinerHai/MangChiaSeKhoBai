import API from "./APIClient";

export interface CreateRentalParams {
  warehouseRef: string; // _id trong backend
  warehouseId: string;
  renterWallet: string;
  ownerWallet: string;
  pricePaidWei: string;
  depositWei: string;
  durationDays: number;
  txHash: string;
  startTime: string;
  endTime: string;
  blockNumber: number;
  chainId: number;
}
export interface Contract {
  _id: string;
  warehouseId: string;
  ownerWallet: string;
  renterWallet: string;
  pricePerDayWei: string;
  totalPriceWei: string;
  depositWei: string;
  startTime: string;
  endTime: string;
  isEnded: boolean;
  txHash: string;
  chainId: number;
  createdAt?: string;
}
/**
 * 🔹 Gọi backend để lưu hợp đồng thuê
 */
export const rentWarehouseOnBackend = async (params: CreateRentalParams) => {
  const res = await API.post("/contracts", params);
  return res.data;
};

/**
 * 🔹 Lấy danh sách hợp đồng theo ví (renter hoặc owner)
 */
export const fetchContractsByWallet = async (wallet: string) => {
  const res = await API.get(`/contracts/user/${wallet}`);
  return res.data;
};

/**
 * 🔹 Kết thúc hợp đồng khi owner yêu cầu
 */
export const requestEndRentalByOwner = async (
  id: string,
  ownerWallet: string
) => {
  const res = await API.patch(`/contracts/end-owner/${id}`, { ownerWallet });
  return res.data;
};

/**
 * 🔹 Đánh dấu hợp đồng đã kết thúc (gọi khi backend bắt event on-chain)
 */
export const markContractEnded = async (txHash: string) => {
  const res = await API.patch(`/contracts/end/${txHash}`);
  return res.data;
};
