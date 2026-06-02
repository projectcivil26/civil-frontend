import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { UserRole } from "@sitestack/types";

interface AuthState {
  role: UserRole | null;
  userId: string | null;
  setRole: (role: UserRole) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    role: null,
    userId: null,
    setRole: (role) =>
      set((state) => {
        state.role = role;
      }),
    clear: () =>
      set((state) => {
        state.role = null;
        state.userId = null;
      }),
  }))
);
