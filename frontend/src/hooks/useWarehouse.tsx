import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchWarehouses,
  fetchWarehouseById,
  saveWarehouseToBackend,
  type WarehouseUpload,
  type fetchWarehouseByIdResponse,
  type Warehouse,
  updateWarehouseOnBackend,
} from "../services/warehouseService";
import type { ethers } from "ethers";
import { updateWarehouseOnChain } from "../services/blockchainService";
/** Tùy chọn linh hoạt */
interface UseWarehouseOptions {
  id?: string; // Nếu có => fetch detail, không có => fetch list
  page?: number;
  limit?: number;
  ownerWallet?: string;
  ownerUserId?: string;
  keyword?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPriceWei?: string;
  maxPriceWei?: string;

  enabled?: boolean;
}

/**
 * Hook tổng hợp để lấy danh sách, chi tiết và lưu kho
 */
export const useWarehouse = ({
  id,
  page = 1,
  limit = 4,
  ownerWallet,
  ownerUserId,
  province,
  district,
  ward,
  street,
  minCapacity,
  maxCapacity,
  minPriceWei,
  maxPriceWei,
  keyword,
  enabled = true,
}: UseWarehouseOptions) => {
  const queryClient = useQueryClient();
  const isDetail = !!id;

  // Build params động cho API
  const params = {
    page,
    limit,
    ownerWallet,
    ownerUserId,
    location,
    minCapacity,
    maxCapacity,
    minPriceWei,
    maxPriceWei,
    keyword,
    province,
    district,
    ward,
    street,
  };

  const query = useQuery({
    queryKey: ["warehouses", id || "list", params],
    queryFn: () =>
      isDetail ? fetchWarehouseById(id!) : fetchWarehouses(params),
    enabled: isDetail ? !!id && enabled : enabled,
    staleTime: 10 * 60 * 1000, // 10 phút
  });

  const mutation = useMutation({
    mutationFn: (data: WarehouseUpload) => saveWarehouseToBackend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      if (id) queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
    },
  });

  return {
    ...query, // data, isLoading, isError, refetch, ...
    saveWarehouse: mutation.mutate,
    isSaving: mutation.isPending,
  };
};

export const useUpdateWarehouse = (provider: ethers.providers.Web3Provider) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (warehouse: WarehouseUpload) => {
      if (!warehouse._id) throw new Error("Thiếu _id khi update warehouse");

      // 🔹 Lấy dữ liệu cũ từ backend
      const resOld: fetchWarehouseByIdResponse = await fetchWarehouseById(
        warehouse._id
      );
      const oldData: Warehouse = resOld.data;

      // 🔹 Kiểm tra có thay đổi giá hoặc deposit không

      const priceChanged =
        Number(warehouse.pricePerDayWei) !== Number(oldData.pricePerDayWei);
      const depositChanged =
        Number(warehouse.depositWei) !== Number(oldData.depositWei);

      let txHash: string | undefined = oldData.txHash;

      // 🔹 Nếu thay đổi thì update trên blockchain trước
      if (priceChanged || depositChanged) {
        console.log("có thay đổi");
        txHash = await updateWarehouseOnChain(
          provider,
          warehouse.warehouseId,
          warehouse.pricePerDayWei,
          warehouse.depositWei
        );
        console.log("✅ Blockchain updated:", txHash);
      }

      // 🔹 Sau đó update backend (luôn gọi)
      const backendRes = await updateWarehouseOnBackend(warehouse, txHash);
      return backendRes;
    },

    // 🔹 React Query tự cập nhật cache sau khi thành công
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", data.data._id] });
    },
  });
};
