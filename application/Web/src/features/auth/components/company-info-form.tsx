"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Building2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyInfoSchema, type CompanyInfoInput } from "@sitestack/schemas";
import { useRegisterWizard } from "../store/register-wizard.store";
import { cn } from "@/lib/utils";

// Style tokens — kept consistent with the rest of the auth flow.
const primaryButton =
  "h-11 w-full rounded-full bg-teal-500 text-base font-semibold text-white hover:bg-teal-600 focus-visible:ring-teal-500";
const inputBase =
  "h-11 w-full rounded-lg border-gray-200 pl-10 text-sm focus-visible:border-teal-500 focus-visible:ring-teal-500";
const textareaBase =
  "min-h-[92px] w-full rounded-lg border border-gray-200 px-3 py-2.5 pl-10 text-sm placeholder:text-muted-foreground focus-visible:border-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500";
const errorText = "text-xs text-rose-500";
const fieldIcon =
  "pointer-events-none absolute left-3 top-3 flex text-gray-400";

export function CompanyInfoForm() {
  const router = useRouter();
  const setCompanyInfo = useRegisterWizard((s) => s.setCompanyInfo);
  const stored = useRegisterWizard((s) => s.companyInfo);

  const form = useForm<CompanyInfoInput>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: stored ?? { companyName: "", registeredAddress: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setCompanyInfo(values);
    // replace, not push: back-button should not walk through wizard steps.
    router.replace("/register/account");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
          Company name
        </Label>
        <div className="relative">
          <span className={cn(fieldIcon, "top-1/2 -translate-y-1/2")}>
            <Building2 className="size-4" />
          </span>
          <Input
            id="companyName"
            placeholder="e.g. Bharat Infra Pvt Ltd"
            autoComplete="organization"
            className={cn(inputBase)}
            {...form.register("companyName")}
          />
        </div>
        {form.formState.errors.companyName && (
          <p className={errorText}>
            {form.formState.errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="registeredAddress"
          className="text-sm font-medium text-gray-700"
        >
          Registered office address
        </Label>
        <div className="relative">
          <span className={fieldIcon}>
            <MapPin className="size-4" />
          </span>
          <textarea
            id="registeredAddress"
            placeholder="Building, street, area, city, state, PIN"
            rows={3}
            className={textareaBase}
            {...form.register("registeredAddress")}
          />
        </div>
        {form.formState.errors.registeredAddress && (
          <p className={errorText}>
            {form.formState.errors.registeredAddress.message}
          </p>
        )}
      </div>

      <Button type="submit" className={primaryButton}>
        Continue
      </Button>
    </form>
  );
}
