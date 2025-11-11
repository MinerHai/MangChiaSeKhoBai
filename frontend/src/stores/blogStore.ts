import { create } from "zustand";

interface BlogFilterState {
  search: string;
  category?: string;
  tag: string | null;
  page: number;
  setSearch: (val: string) => void;
  setCategory: (slug: string | null) => void;
  setTag: (val: string | null) => void;
  setPage: (val: number) => void;
}

export const useBlogFilterStore = create<BlogFilterState>((set) => ({
  search: "",
  category: undefined,
  tag: null,
  page: 1,
  setSearch: (val) => set({ search: val }),
  setCategory: (slug) => set({ category: slug || undefined }),
  setTag: (val) => set({ tag: val }),
  setPage: (val) => set({ page: val }),
}));
