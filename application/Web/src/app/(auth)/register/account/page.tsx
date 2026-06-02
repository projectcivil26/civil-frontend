import type { Metadata } from "next";
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { RegisterForm } from "@/features/auth/components/register-form";
import { WizardStepper } from "@/features/auth/components/wizard-stepper";
import { AuthCard } from "@/components/shared/auth-card";

export const metadata: Metadata = {
  title: "Create your account — SiteStack ERP",
  description:
    "Step 2 of 3 — Create your personal SiteStack account to manage your company workspace.",
};

// Step 2 of the register wizard: personal account creation.
export default function RegisterAccountPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel />

      <section className="flex items-center justify-center bg-brand-bg px-4 py-10 sm:px-8">
        <AuthCard>
          <div className="space-y-6">
            <WizardStepper current={2} total={3} label="Your account" />
            <header className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="text-sm text-gray-500">
                You&apos;ll use this to sign in to SiteStack.
              </p>
            </header>
            <RegisterForm />
          </div>
        </AuthCard>
      </section>
    </main>
  );
}
