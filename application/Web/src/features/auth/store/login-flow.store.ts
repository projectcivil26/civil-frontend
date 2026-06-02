import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  DeactivatedAccountInfo,
  LoginFailureReason,
} from "../types";

// Max wrong-password attempts before the account is auto-locked locally.
// Backend is the real source of truth; this is for snappy UX.
export const LOGIN_MAX_ATTEMPTS = 3;
// Lockout window in seconds (15 min).
export const LOGIN_LOCKOUT_SECONDS = 15 * 60;

interface LoginFlowState {
  // ── Failure state ──
  failureReason: LoginFailureReason | null;
  attemptsLeft: number;
  // Wall-clock timestamp (ms since epoch) when the lockout expires.
  lockedUntil: number | null;
  // Populated when the backend returns a deactivated-account response.
  deactivated: DeactivatedAccountInfo | null;

  // ── OTP flow continuity ──
  // The phone number entered on /login/otp, read by /login/otp/verify.
  otpPhoneNumber: string | null;
  // Masked phone returned by the backend, shown on the verify screen.
  otpMaskedPhone: string | null;

  // ── Actions ──
  registerWrongPassword: () => void;
  setLocked: (until?: number) => void;
  setDeactivated: (info: DeactivatedAccountInfo) => void;
  clearFailure: () => void;
  setOtpPhone: (phoneNumber: string, maskedPhone?: string) => void;
  clearOtpFlow: () => void;
  reset: () => void;
}

const initialState = {
  failureReason: null,
  attemptsLeft: LOGIN_MAX_ATTEMPTS,
  lockedUntil: null,
  deactivated: null,
  otpPhoneNumber: null,
  otpMaskedPhone: null,
};

export const useLoginFlow = create<LoginFlowState>()(
  immer((set) => ({
    ...initialState,

    registerWrongPassword: () =>
      set((s) => {
        const remaining = Math.max(0, s.attemptsLeft - 1);
        s.attemptsLeft = remaining;
        if (remaining === 0) {
          s.failureReason = "locked";
          s.lockedUntil = Date.now() + LOGIN_LOCKOUT_SECONDS * 1000;
        } else {
          s.failureReason = "wrong_password";
        }
      }),

    setLocked: (until) =>
      set((s) => {
        s.failureReason = "locked";
        s.lockedUntil = until ?? Date.now() + LOGIN_LOCKOUT_SECONDS * 1000;
        s.attemptsLeft = 0;
      }),

    setDeactivated: (info) =>
      set((s) => {
        s.failureReason = "deactivated";
        s.deactivated = info;
      }),

    clearFailure: () =>
      set((s) => {
        s.failureReason = null;
        s.attemptsLeft = LOGIN_MAX_ATTEMPTS;
        s.lockedUntil = null;
        s.deactivated = null;
      }),

    setOtpPhone: (phoneNumber, maskedPhone) =>
      set((s) => {
        s.otpPhoneNumber = phoneNumber;
        s.otpMaskedPhone = maskedPhone ?? null;
      }),

    clearOtpFlow: () =>
      set((s) => {
        s.otpPhoneNumber = null;
        s.otpMaskedPhone = null;
      }),

    reset: () => set(() => ({ ...initialState })),
  })),
);
