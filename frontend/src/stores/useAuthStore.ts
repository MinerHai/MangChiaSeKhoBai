import { create } from "zustand";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  token?: string;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  restoreSession: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.token) localStorage.setItem("token", user.token);
    set({ user, isLoading: false });
  },

  clearUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },

  restoreSession: () => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      set({ user: parsed, isLoading: false });
    } else {
      set({ user: null, isLoading: false });
    }
  },
}));
