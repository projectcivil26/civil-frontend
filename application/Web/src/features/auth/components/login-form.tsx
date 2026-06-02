"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { Lock, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { loginSchema, type LoginInput } from "../schema";
import { useLogin } from "../hooks/use-login";
import { useLoginFlow } from "../store/login-flow.store";
import {
  dividerWithText,
  errorText,
  fieldIcon,
  inputBase,
  inputErrorRing,
  linkText,
  primaryButton,
  secondaryButton,
} from "../styles";
import { AccountDeactivatedView } from "./account-deactivated-view";
import { AccountLockedAlert } from "./account-locked-alert";
import { LoginErrorAlert } from "./login-error-alert";
import { LoginMethodTabs } from "./login-method-tabs";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const failureReason = useLoginFlow((s) => s.failureReason);
  const attemptsLeft = useLoginFlow((s) => s.attemptsLeft);
  const clearFailure = useLoginFlow((s) => s.clearFailure);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", rememberMe: true },
  });

  // Deactivated accounts replace the whole form.
  if (failureReason === "deactivated") return <AccountDeactivatedView />;

  const locked = failureReason === "locked";
  const wrongPassword = failureReason === "wrong_password";

  const onSubmit = form.handleSubmit((values) => {
    // Guard against locked state AND in-flight requests — button-disabled
    // doesn't stop Enter-key spam between disable cycles.
    if (locked || login.isPending) return;
    login.mutate(values);
  });

  // Clear inline failure when the user resumes typing.
  const onTypingClear = () => {
    if (failureReason) clearFailure();
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-500">
          Use your username, email, or phone.
        </p>
      </header>

      <LoginMethodTabs current="password" />

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AnimatePresence initial={false}>
          {wrongPassword && (
            <LoginErrorAlert key="wrong" attemptsLeft={attemptsLeft} />
          )}
          {locked && <AccountLockedAlert key="locked" />}
        </AnimatePresence>

        <Field
          id="identifier"
          label="Username, email or phone"
          error={form.formState.errors.identifier?.message}
        >
          <Input
            id="identifier"
            autoComplete="username"
            placeholder="vikram@sharmaconstructions.in"
            className={cn(inputBase, "pl-3")}
            disabled={locked}
            {...form.register("identifier", { onChange: onTypingClear })}
          />
        </Field>

        <div>
          <Field
            id="password"
            label="Password"
            error={form.formState.errors.password?.message}
          >
            <span className={fieldIcon}>
              <Lock className="size-4" />
            </span>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={cn(inputBase, "pr-14", wrongPassword && inputErrorRing)}
              disabled={locked}
              {...form.register("password", { onChange: onTypingClear })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </Field>

          <div className="mt-1.5 text-right">
            <Link href="/login/forgot" className={`${linkText} text-xs`}>
              Forgot password?
            </Link>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="size-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
            disabled={locked}
            {...form.register("rememberMe")}
          />
          Keep me signed in for 7 days
        </label>

        <Button
          type="submit"
          disabled={locked || login.isPending}
          className={primaryButton}
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </Button>

        <div className={dividerWithText}>or</div>

        <Button asChild variant="outline" className={secondaryButton}>
          <Link href="/login/otp">
            <Smartphone className="size-4" />
            Sign in with SMS OTP
          </Link>
        </Button>

        <p className="text-center text-sm text-gray-500">
          New to Site Stack?{" "}
          <Link href="/register" className={linkText}>
            Register your company
          </Link>
        </p>
      </form>
    </div>
  );
}

// Small local Field wrapper — keeps the input + label + error neatly grouped.
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">{children}</div>
      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}
