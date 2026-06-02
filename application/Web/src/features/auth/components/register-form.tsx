"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, Phone, User2, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "../schema";
import { useRegister } from "../hooks/use-register";
import { useRegisterWizard } from "../store/register-wizard.store";
import { VerifyMethodDialog } from "./verify-method-dialog";
import { maskEmail, maskPhoneIndian } from "@/lib/utils/mask";
import type { VerificationMethod } from "@sitestack/schemas";
import { cn } from "@/lib/utils";

// Style tokens
const primaryButton =
  "h-11 w-full rounded-full bg-teal-500 text-base font-semibold text-white hover:bg-teal-600 focus-visible:ring-teal-500";
const inputBase =
  "h-11 w-full rounded-lg border-gray-200 pl-10 text-sm focus-visible:border-teal-500 focus-visible:ring-teal-500";
const errorText = "text-xs text-rose-500";
const fieldIcon =
  "pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400";
const phonePrefix =
  "pointer-events-none absolute inset-y-0 left-9 flex items-center pr-2 text-sm text-gray-500 border-r border-gray-200 pl-2";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const register = useRegister();
  const companyInfo = useRegisterWizard((s) => s.companyInfo);
  const setAccount = useRegisterWizard((s) => s.setAccount);
  const setVerification = useRegisterWizard((s) => s.setVerification);

  // Guard: missing step 1 data → bounce back.
  useEffect(() => {
    if (!companyInfo) router.replace("/register");
  }, [companyInfo, router]);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  // Step 1: validate locally → open the method picker dialog.
  // Guard against opening the dialog mid-request (Enter-key spam).
  const onSubmit = form.handleSubmit(() => {
    if (register.isPending) return;
    setMethodOpen(true);
  });

  // Step 2: dialog choice → fire the API with chosen method.
  const handleMethodSelect = (method: VerificationMethod) => {
    // Defensive: if the dialog is somehow re-clicked while a request is in
    // flight, don't fire another mutation.
    if (!companyInfo || register.isPending) return;
    const values = form.getValues();
    setAccount({
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
    });
    setVerification({
      method,
      destination:
        method === "email"
          ? maskEmail(values.email)
          : maskPhoneIndian(values.phoneNumber),
    });
    setMethodOpen(false);
    register.mutate({ ...values, companyInfo, verificationMethod: method });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          id="fullName"
          label="Full name"
          icon={<User2 className="size-4" />}
          error={form.formState.errors.fullName?.message}
        >
          <Input
            id="fullName"
            placeholder="Vikram Sharma"
            autoComplete="name"
            className={cn(inputBase)}
            {...form.register("fullName")}
          />
        </Field>

        <Field
          id="email"
          label="Email"
          icon={<AtSign className="size-4" />}
          error={form.formState.errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="you@company.in"
            autoComplete="email"
            className={cn(inputBase)}
            {...form.register("email")}
          />
        </Field>

        <div className="space-y-1.5">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Phone number
          </Label>
          <div className="relative">
            <span className={fieldIcon}>
              <Phone className="size-4" />
            </span>
            <span className={phonePrefix}>+91</span>
            <Input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              autoComplete="tel-national"
              className={cn(inputBase, "pl-20")}
              {...form.register("phoneNumber")}
            />
          </div>
          {form.formState.errors.phoneNumber && (
            <p className={errorText}>
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <Field
          id="password"
          label="Password"
          icon={<Lock className="size-4" />}
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className={cn(inputBase, "pr-10")}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </Field>

        <Field
          id="confirmPassword"
          label="Confirm password"
          icon={<Lock className="size-4" />}
          error={form.formState.errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className={cn(inputBase)}
            {...form.register("confirmPassword")}
          />
        </Field>

        <label className="flex items-start gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
            {...form.register("agreeToTerms")}
          />
          <span>
            I agree to the{" "}
            <Link
              href="#"
              className="font-medium text-teal-600 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-medium text-teal-600 hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        {form.formState.errors.agreeToTerms && (
          <p className={errorText}>
            {form.formState.errors.agreeToTerms.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={register.isPending}
          className={primaryButton}
        >
          {register.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <VerifyMethodDialog
        open={methodOpen}
        onOpenChange={setMethodOpen}
        email={form.getValues("email") || ""}
        phoneNumber={form.getValues("phoneNumber") || ""}
        onSelect={handleMethodSelect}
        isLoading={register.isPending}
      />
    </>
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, icon, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <span className={fieldIcon}>{icon}</span>
        {children}
      </div>
      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}
