"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteStackLogo } from "@/components/shared/site-stack-logo";
import { cn } from "@/lib/utils";

import {
  loginOtpRequestSchema,
  type LoginOtpRequestInput,
} from "../schema";
import { useRequestLoginOtp } from "../hooks/use-request-login-otp";
import {
  errorText,
  fieldIcon,
  inputBase,
  linkText,
  primaryButton,
} from "../styles";
import { LoginMethodTabs } from "./login-method-tabs";

const phonePrefix =
  "pointer-events-none absolute inset-y-0 left-9 flex items-center border-r border-gray-200 pl-2 pr-2 text-sm text-gray-500";

export function LoginOtpRequestForm() {
  const request = useRequestLoginOtp();

  const form = useForm<LoginOtpRequestInput>({
    resolver: zodResolver(loginOtpRequestSchema),
    defaultValues: { phoneNumber: "", rememberMe: true },
  });

  const onSubmit = form.handleSubmit((values) => {
    // Stop Enter-key spam from firing duplicate OTP requests.
    if (request.isPending) return;
    request.mutate(values);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <SiteStackLogo showWordmark={false} />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Sign in with OTP
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          We&apos;ll text a one-time code to your registered phone.
        </p>
      </div>

      <LoginMethodTabs current="sms-otp" />

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
            Phone number
          </Label>
          <div className="relative">
            <span className={fieldIcon}>
              <Phone className="size-4" />
            </span>
            <span className={phonePrefix}>IN +91</span>
            <Input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              placeholder="98765 43210"
              className={cn(inputBase, "pl-24")}
              {...form.register("phoneNumber")}
            />
          </div>
          {form.formState.errors.phoneNumber && (
            <p className={errorText}>
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={request.isPending}
          className={primaryButton}
        >
          {request.isPending ? "Sending code..." : "Send code"}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className={`${linkText} inline-flex items-center gap-1.5 text-sm`}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Sign in with password instead
          </Link>
        </div>
      </form>
    </div>
  );
}
