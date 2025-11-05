import axios from "axios";

const WEI_IN_ETH = 1e18;

export function weiToEth(wei: string | number): number {
  return Number(wei) / WEI_IN_ETH;
}

export async function getEthToVndRate(): Promise<number> {
  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: { ids: "ethereum", vs_currencies: "vnd" },
      }
    );
    return res.data.ethereum.vnd;
  } catch (err) {
    console.error("⚠️ Lỗi khi lấy tỷ giá ETH/VND:", err);
    return 0;
  }
}

export function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}
