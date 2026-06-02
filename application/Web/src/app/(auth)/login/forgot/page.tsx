import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { AuthCard } from "@/components/shared/auth-card";

export const metadata: Metadata = {
  title: "Forgot password — SiteStack ERP",
};

// Placeholder until the password-reset flow is built out. Linked from the
// sign-in form so the "Forgot password?" CTA doesn't 404.
export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel
        title={<>Welcome back.</>}
        description="Pick up where you left off. Your sites, payroll, and bills are waiting."
      />

      <section className="flex items-center justify-center bg-brand-bg px-4 py-10 sm:px-8">
        <AuthCard>
          <div className="space-y-6">
            <header className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Reset your password
              </h1>
              <p className="text-sm text-gray-500">
                Password reset is rolling out next. For now, reach out to your
                company administrator or email{" "}
                <a
                  href="mailto:support@sitestack.app"
                  className="font-semibold text-teal-600 hover:underline"
                >
                  support@sitestack.app
                </a>
                .
              </p>
            </header>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to sign in
            </Link>
          </div>
        </AuthCard>
      </section>
    </main>
  );
}
