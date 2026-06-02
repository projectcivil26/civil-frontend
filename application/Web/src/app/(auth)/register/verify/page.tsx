import type { Metadata } from "next";
import { AuthCard } from "@/components/shared/auth-card";
import { VerifyOtpForm } from "@/features/auth/components/verify-otp-form";

export const metadata: Metadata = {
  title: "Verify your code — SiteStack ERP",
  description:
    "Step 3 of 3 — Enter the 6-digit code we just sent to verify your account.",
};

// Step 3 — Centered single-column layout matching the reference design.
// No brand panel here; this is a focused verification action.
export default function RegisterVerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-10">
      <AuthCard>
        <VerifyOtpForm />
      </AuthCard>
    </main>
  );
}
