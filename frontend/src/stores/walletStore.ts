import { create } from "zustand";
import { ethers } from "ethers";

interface WalletState {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  isUnlocked: boolean;
  isConnecting: boolean;
  error: string | null;

  connectWallet: () => Promise<void>;
  setAddress: (address: string) => void;
  clearWallet: () => void;
  resetError: () => void;
  initAutoDetect: () => () => void; // THÊM DÒNG NÀY
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
      set({ isUnlocked: true, error: null });
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

      set({ address, provider, isUnlocked: true, isConnecting: false });
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
    isUnlocked: false,
    isConnecting: false,
    error: null,

    connectWallet: async () => {
      // Bước 1: Kiểm tra MetaMask
      if (!(window as any).ethereum) {
        set({ error: "Vui lòng cài MetaMask!" });
        return;
      }

      // Bước 2: Kiểm tra đã unlock chưa
      const unlocked = await checkWalletStatus();
      if (!unlocked) {
        set({ error: "Vui lòng mở MetaMask và nhập mật khẩu để tiếp tục!" });
        return;
      }

      // Bước 3: Đã unlock → thử ký luôn (chỉ 1 popup)
      await tryAutoConnectAndSign();
    },

    setAddress: (address: string) => set({ address }),
    clearWallet: () =>
      set({
        address: null,
        provider: null,
        isUnlocked: false,
        isConnecting: false,
      }),
    resetError: () => set({ error: null }),

    // Hàm này trả về cleanup
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
