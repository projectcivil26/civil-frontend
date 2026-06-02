"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OtpInput } from "./otp-input";
import { useResendTimer } from "../hooks/use-resend-timer";
import { useRegisterWizard } from "../store/register-wizard.store";
import { SiteStackLogo } from "@/components/shared/site-stack-logo";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 60;

const primaryButton =
  "h-12 w-full rounded-full bg-teal-500 text-base font-semibold text-white hover:bg-teal-600 focus-visible:ring-teal-500 disabled:opacity-60";

export function VerifyOtpForm() {
  const router = useRouter();
  const account = useRegisterWizard((s) => s.account);
  const verification = useRegisterWizard((s) => s.verification);

  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { secondsLeft, canResend, reset } = useResendTimer(
    RESEND_COOLDOWN_SECONDS
  );

  // Guard: must come from step 2.
  useEffect(() => {
    if (!verification || !account) router.replace("/register");
  }, [verification, account, router]);

  const handleChange = (next: string) => {
    setCode(next);
    if (showError) setShowError(false);
  };

  const handleVerify = async () => {
    if (code.length !== OTP_LENGTH || !account) return;
    setSubmitting(true);
    try {
      // userId comes from the register response; in this stub we use email
      // as a placeholder identifier until the API is wired up end-to-end.
      await authService.verifyOtp(account.email, code);
      toast.success("Email verified");
      // replace, not push: don't let back-button return to the OTP screen
      router.replace("/dashboard");
    } catch {
      const remaining = Math.max(0, attemptsLeft - 1);
      setAttemptsLeft(remaining);
      setShowError(true);
      setCode("");
      if (remaining === 0) {
        toast.error("Too many attempts. Restart registration.");
        router.replace("/register");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !account || !verification) return;
    try {
      await authService.resendOtp(account.email, verification.method);
      toast.success("New code sent");
      reset();
      setAttemptsLeft(MAX_ATTEMPTS);
      setShowError(false);
    } catch {
      toast.error("Couldn't send a new code. Try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <SiteStackLogo showWordmark={false} />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Verify your {verification?.method === "sms" ? "phone" : "email"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-semibold text-gray-900">
          {verification?.destination ?? ""}
        </p>
      </div>

      {showError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
            <AlertTriangle className="size-4" />
            Wrong code
          </div>
          <p className="mt-0.5 text-xs text-rose-600">
            {attemptsLeft} attempts left. Codes expire in 5 minutes.
          </p>
        </div>
      )}

      <OtpInput
        value={code}
        onChange={handleChange}
        error={showError}
        autoFocus
        length={OTP_LENGTH}
        disabled={submitting}
      />

      <Button
        onClick={handleVerify}
        disabled={code.length !== OTP_LENGTH || submitting}
        className={primaryButton}
      >
        {submitting ? "Verifying..." : "Verify"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn&apos;t get it?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-teal-600 hover:underline"
          >
            Resend code
          </button>
        ) : (
          <span>Resend in {secondsLeft}s</span>
        )}
      </p>
    </div>
  );
}
