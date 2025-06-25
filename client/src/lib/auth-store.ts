import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@shared/schema";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      
      setUser: (user: User | null) => {
        set({ user });
      },
      
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
      
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "naturevital-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
