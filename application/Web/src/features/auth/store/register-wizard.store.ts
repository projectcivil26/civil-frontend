"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CompanyInfoInput,
  VerificationMethod,
} from "@sitestack/schemas";

// Multi-step register wizard state.
// Persisted to sessionStorage so a page refresh mid-flow doesn't lose data,
// but the data clears when the browser tab closes.

interface AccountStub {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface VerificationStub {
  method: VerificationMethod;
  destination: string; // already masked, safe to display
}

interface RegisterWizardState {
  companyInfo: CompanyInfoInput | null;
  account: AccountStub | null;
  verification: VerificationStub | null;
  setCompanyInfo: (data: CompanyInfoInput) => void;
  setAccount: (data: AccountStub) => void;
  setVerification: (data: VerificationStub) => void;
  reset: () => void;
}

export const useRegisterWizard = create<RegisterWizardState>()(
  persist(
    (set) => ({
      companyInfo: null,
      account: null,
      verification: null,
      setCompanyInfo: (companyInfo) => set({ companyInfo }),
      setAccount: (account) => set({ account }),
      setVerification: (verification) => set({ verification }),
      reset: () =>
        set({ companyInfo: null, account: null, verification: null }),
    }),
    {
      name: "sitestack-register-wizard",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
