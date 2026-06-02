import type { Metadata } from "next";

import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { LoginForm } from "@/features/auth/components/login-form";
import { AuthCard } from "@/components/shared/auth-card";

export const metadata: Metadata = {
  title: "Sign in — SiteStack ERP",
  description:
    "Sign in to your SiteStack workspace with your username, email, or phone.",
};

export default function LoginPage() {
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
          <LoginForm />
        </AuthCard>
      </section>
    </main>
  );
}
