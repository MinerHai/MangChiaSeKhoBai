import { create } from "zustand";

interface CategoryState {
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (id) => set({ selectedCategory: id }),
}));
