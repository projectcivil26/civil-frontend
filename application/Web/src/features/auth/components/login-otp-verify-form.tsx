"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SiteStackLogo } from "@/components/shared/site-stack-logo";

import { OtpInput } from "./otp-input";
import { useVerifyLoginOtp } from "../hooks/use-verify-login-otp";
import { useRequestLoginOtp } from "../hooks/use-request-login-otp";
import { useResendTimer } from "../hooks/use-resend-timer";
import { useLoginFlow } from "../store/login-flow.store";
import { linkText, primaryButton } from "../styles";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export function LoginOtpVerifyForm() {
  const router = useRouter();
  const otpPhoneNumber = useLoginFlow((s) => s.otpPhoneNumber);
  const otpMaskedPhone = useLoginFlow((s) => s.otpMaskedPhone);

  const [code, setCode] = useState("");
  const [showError, setShowError] = useState(false);
  const verify = useVerifyLoginOtp();
  const requestAgain = useRequestLoginOtp();
  const { secondsLeft, canResend, reset } = useResendTimer(
    RESEND_COOLDOWN_SECONDS,
  );

  // Guard: must have entered a phone on the previous step.
  useEffect(() => {
    if (!otpPhoneNumber) router.replace("/login/otp");
  }, [otpPhoneNumber, router]);

  const handleVerify = () => {
    // Guard against in-flight requests so rapid clicks can't fire duplicates.
    if (!otpPhoneNumber || code.length !== OTP_LENGTH || verify.isPending) {
      return;
    }
    verify.mutate(
      { phoneNumber: otpPhoneNumber, code, rememberMe: true },
      {
        onError: () => {
          setShowError(true);
          setCode("");
        },
      },
    );
  };

  const handleResend = () => {
    // Also guard against in-flight resends — the link is hidden during pending
    // but defensive in case the timer races the click.
    if (!canResend || !otpPhoneNumber || requestAgain.isPending) return;
    requestAgain.mutate(
      { phoneNumber: otpPhoneNumber, rememberMe: true },
      {
        onSuccess: () => {
          toast.success("New code sent");
          reset();
          setShowError(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <SiteStackLogo showWordmark={false} />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Enter your code
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sent to <span className="font-semibold text-gray-900">{otpMaskedPhone ?? ""}</span>
          . Valid for 5 min.
        </p>
      </div>

      <OtpInput
        value={code}
        onChange={(next) => {
          setCode(next);
          if (showError) setShowError(false);
        }}
        error={showError}
        autoFocus
        length={OTP_LENGTH}
        disabled={verify.isPending}
      />

      <Button
        onClick={handleVerify}
        disabled={code.length !== OTP_LENGTH || verify.isPending}
        className={primaryButton}
      >
        {verify.isPending ? "Verifying..." : "Verify & sign in"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn&apos;t get it?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className={linkText}
            disabled={requestAgain.isPending}
          >
            Resend code
          </button>
        ) : (
          <span>Resend in {secondsLeft}s</span>
        )}
      </p>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.replace("/login/otp")}
          className={`${linkText} text-sm`}
        >
          Use a different number
        </button>
      </div>
    </div>
  );
}
