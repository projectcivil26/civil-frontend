"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authService } from "../services/auth.service";
import { useLoginFlow } from "../store/login-flow.store";
import { maskPhoneIndian } from "@/lib/utils/mask";
import type { LoginOtpRequestInput, LoginOtpRequestResponse } from "../types";

export function useRequestLoginOtp() {
  const router = useRouter();
  const setOtpPhone = useLoginFlow((s) => s.setOtpPhone);

  return useMutation<LoginOtpRequestResponse, Error, LoginOtpRequestInput>({
    mutationFn: ({ phoneNumber }) => authService.requestLoginOtp(phoneNumber),
    onSuccess: (data, variables) => {
      // Backend's mask wins; fall back to a client-side mask if it's missing.
      setOtpPhone(
        variables.phoneNumber,
        data.maskedPhone || maskPhoneIndian(variables.phoneNumber),
      );
      toast.success("Code sent");
      // replace, not push: back-button should bounce to /login, not back to
      // the phone-entry screen.
      router.replace("/login/otp/verify");
    },
    onError: (err) => {
      toast.error(err.message || "Couldn't send the code. Try again.");
    },
  });
}
