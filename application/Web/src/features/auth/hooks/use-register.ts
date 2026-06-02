"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  CompanyInfoInput,
  VerificationMethod,
} from "@sitestack/schemas";
import { authService } from "../services/auth.service";
import type { RegisterInput, RegisterResponse } from "../types";

// Combined payload: company info from wizard store + account info from the form
// + the verification method the user picked in the dialog.
export type RegisterCombinedInput = RegisterInput & {
  companyInfo: CompanyInfoInput;
  verificationMethod: VerificationMethod;
};

export function useRegister() {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterCombinedInput>({
    mutationFn: ({ companyInfo, verificationMethod, ...account }) =>
      authService.register(account, companyInfo, verificationMethod),
    onSuccess: () => {
      toast.success("Verification code sent");
      // replace, not push: back-button should bounce to /register, not the
      // half-filled account step the user just submitted.
      router.replace("/register/verify");
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed. Please try again.");
    },
  });
}
