import type { Metadata } from "next";

import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { LoginOtpVerifyForm } from "@/features/auth/components/login-otp-verify-form";
import { AuthCard } from "@/components/shared/auth-card";

export const metadata: Metadata = {
  title: "Verify your code — SiteStack ERP",
  description: "Enter the 6-digit code we texted to your phone to sign in.",
};

export default function LoginOtpVerifyPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel
        title={<>Welcome back.</>}
        description="Pick up where you left off. Your sites, payroll, and bills are waiting."
      />

      <section className="flex items-center justify-center bg-brand-bg px-4 py-10 sm:px-8">
        <AuthCard>
          <LoginOtpVerifyForm />
        </AuthCard>
      </section>
    </main>
  );
}
