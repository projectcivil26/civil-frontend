"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import type { VerifyOtpResponse } from "../types";

interface VerifyOtpVars {
  userId: string;
  code: string;
}

export function useVerifyOtp() {
  const router = useRouter();

  return useMutation<VerifyOtpResponse, Error, VerifyOtpVars>({
    mutationFn: ({ userId, code }) => authService.verifyOtp(userId, code),
    onSuccess: () => {
      toast.success("Email verified");
      // replace, not push: don't let back-button return to the OTP screen
      router.replace("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Invalid code. Try again.");
    },
  });
}
