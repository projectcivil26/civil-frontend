import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as SecureStore from "expo-secure-store";
import { setMobileTokenProvider } from "@sitestack/api-client";
import type { UserRole } from "@sitestack/types";

// Register the secure token provider once so the shared api-client
// attaches the Bearer token on every mobile request automatically.
setMobileTokenProvider(() => SecureStore.getItemAsync(TOKEN_KEY));

const TOKEN_KEY = "sitestack_access_token";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  userId: string | null;
  setSession: (token: string, role: UserRole, userId: string) => Promise<void>;
  clearSession: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    token: null,
    role: null,
    userId: null,
    setSession: async (token, role, userId) => {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      set((state) => {
        state.token = token;
        state.role = role;
        state.userId = userId;
      });
    },
    clearSession: async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      set((state) => {
        state.token = null;
        state.role = null;
        state.userId = null;
      });
    },
    loadToken: async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      set((state) => {
        state.token = token;
      });
    },
  }))
);
