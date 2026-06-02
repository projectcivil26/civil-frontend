import type { Metadata } from "next";

import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { LoginOtpRequestForm } from "@/features/auth/components/login-otp-request-form";
import { AuthCard } from "@/components/shared/auth-card";

export const metadata: Metadata = {
  title: "Sign in with OTP — SiteStack ERP",
  description:
    "Get a one-time code on your registered phone to sign in to SiteStack.",
};

export default function LoginOtpPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel
        title={<>Welcome back.</>}
        description="Pick up where you left off. Your sites, payroll, and bills are waiting."
        tip={{
          eyebrow: "Tip for site users",
          body: (
            <>
              Use <span className="font-semibold">Login with OTP</span> for
              faster sign-in on phones — no password to remember.
            </>
          ),
        }}
      />

      <section className="flex items-center justify-center bg-brand-bg px-4 py-10 sm:px-8">
        <AuthCard>
          <LoginOtpRequestForm />
        </AuthCard>
      </section>
    </main>
  );
}
