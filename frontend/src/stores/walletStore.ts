import { create } from "zustand";
import { ethers } from "ethers";

interface WalletState {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  connectWallet: () => Promise<void>;
  setAddress: (address: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  provider: null,

  connectWallet: async () => {
    try {
      if (!(window as any).ethereum) {
        alert("Vui lòng cài MetaMask!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("not passed");
      // Bắt xác nhận mỗi lần
      const message = "Xác nhận danh tính với ứng dụng của tôi";
      await signer.signMessage(message);

      console.log("passed");
      const address = await signer.getAddress();
      set({ address, provider });
    } catch (error: any) {
      console.log(error);
    }
  },
  setAddress: (address: string) => set({ address }),
  clearWallet: () => set({ address: null, provider: null }),
}));
