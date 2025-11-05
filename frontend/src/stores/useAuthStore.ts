import { create } from "zustand";
import {
  fetchUserProfile,
  logout as logoutService,
} from "../services/authService";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  isActive: boolean;
  isTwoFactorEnabled: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => {
    set({ user, isLoading: false });
  },

  clearUser: () => {
    set({ user: null });
  },

  logout: async () => {
    try {
      await logoutService(); // gọi API /auth/logout → xoá cookie backend
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({ user: null });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchUserProfile();
      set({ user: data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
}));
