import type { Metadata } from "next";
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { CompanyInfoForm } from "@/features/auth/components/company-info-form";
import { WizardStepper } from "@/features/auth/components/wizard-stepper";
import { AuthCard } from "@/components/shared/auth-card";

export const metadata: Metadata = {
  title: "Tell us about your company — SiteStack ERP",
  description:
    "Step 1 of 3 — Share a few details about your construction firm to set up your SiteStack workspace.",
};

// Step 1 of the register wizard: company information.
export default function RegisterCompanyPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel />

      <section className="flex items-center justify-center bg-brand-bg px-4 py-10 sm:px-8">
        <AuthCard>
          <div className="space-y-6">
            <WizardStepper current={1} total={3} label="Company details" />
            <header className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Tell us about your company
              </h1>
              <p className="text-sm text-gray-500">
                We&apos;ll use this to set up your workspace.
              </p>
            </header>
            <CompanyInfoForm />
          </div>
        </AuthCard>
      </section>
    </main>
  );
}
