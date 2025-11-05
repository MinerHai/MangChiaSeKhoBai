import { create } from "zustand";
import { ethers } from "ethers";

interface WalletState {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isUnlocked: boolean;
  isConnecting: boolean;
  error: string | null;

  connectWallet: () => Promise<void>;
  setAddress: (address: string) => void;
  clearWallet: () => void;
  resetError: () => void;
  initAutoDetect: () => () => void;
}

export const useWalletStore = create<WalletState>((set, get) => {
  const checkWalletStatus = async () => {
    if (!(window as any).ethereum) {
      set({ isUnlocked: false, error: "Vui lòng cài MetaMask!" });
      return false;
    }

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const accounts = await provider.listAccounts();

    if (accounts.length > 0) {
      set({ isUnlocked: true, error: null, provider });
      return true;
    } else {
      set({
        isUnlocked: false,
        error: "Vui lòng mở MetaMask và nhập mật khẩu!",
      });
      return false;
    }
  };

  const tryAutoConnectAndSign = async () => {
    const { isUnlocked, isConnecting } = get();
    if (!isUnlocked || isConnecting) return;

    set({ isConnecting: true, error: null });

    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) return;

      const signer = provider.getSigner();
      const address = accounts[0];

      const message = `Xác nhận đăng nhập vào ứng dụng\nĐịa chỉ: ${address}\nThời gian: ${new Date().toLocaleString()}`;
      await signer.signMessage(message);

      set({
        address,
        provider,
        signer,
        isUnlocked: true,
        isConnecting: false,
      });
      console.log("Đăng nhập thành công:", address);
    } catch (error: any) {
      set({ isConnecting: false });
      if (error.code !== 4001) {
        set({ error: "Đã có lỗi khi kết nối. Vui lòng thử lại." });
      }
    }
  };

  return {
    address: null,
    provider: null,
    signer: null,
    isUnlocked: false,
    isConnecting: false,
    error: null,

    connectWallet: async () => {
      if (!(window as any).ethereum) {
        set({ error: "Vui lòng cài MetaMask!" });
        return;
      }

      const unlocked = await checkWalletStatus();
      if (!unlocked) {
        set({ error: "Vui lòng mở MetaMask và nhập mật khẩu để tiếp tục!" });
        return;
      }

      await tryAutoConnectAndSign();
    },

    setAddress: (address: string) => set({ address }),
    clearWallet: () =>
      set({
        address: null,
        provider: null,
        signer: null,
        isUnlocked: false,
        isConnecting: false,
      }),
    resetError: () => set({ error: null }),

    initAutoDetect: () => {
      if (!(window as any).ethereum) return () => {};

      checkWalletStatus().then((unlocked) => {
        if (unlocked) tryAutoConnectAndSign();
      });

      const interval = setInterval(() => {
        checkWalletStatus().then((unlocked) => {
          if (unlocked && !get().address) {
            tryAutoConnectAndSign();
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    },
  };
});
