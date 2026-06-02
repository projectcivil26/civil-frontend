"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authService } from "../services/auth.service";
import { useLoginFlow } from "../store/login-flow.store";
import type { LoginOtpVerifyInput } from "../types";

export function useVerifyLoginOtp() {
  const router = useRouter();
  const clearOtpFlow = useLoginFlow((s) => s.clearOtpFlow);
  const clearFailure = useLoginFlow((s) => s.clearFailure);

  return useMutation<{ ok: true }, Error, LoginOtpVerifyInput>({
    mutationFn: ({ phoneNumber, code, rememberMe }) =>
      authService.verifyLoginOtp(phoneNumber, code, rememberMe),
    onSuccess: () => {
      clearFailure();
      clearOtpFlow();
      toast.success("Signed in");
      // replace, not push: don't let back-button return to the OTP screen
      router.replace("/dashboard");
    },
    onError: (err) => {
      // OTP-specific errors (wrong code, expired) are surfaced inline by the
      // form so the user can retry without losing context.
      toast.error(err.message || "Couldn't verify the code. Try again.");
    },
  });
}
