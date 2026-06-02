"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type Method = "password" | "sms-otp";

interface LoginMethodTabsProps {
  current: Method;
}

const wrapper =
  "relative grid grid-cols-2 rounded-full border border-gray-200 bg-gray-50 p-1";
const tabBase =
  "relative z-10 flex h-9 items-center justify-center rounded-full text-sm font-medium transition-colors";

// Pill toggle that doubles as navigation between /login (password) and
// /login/otp (sms). Active tab gets a sliding white pill — Framer Motion
// shared layout makes the swap feel continuous with the register flow.
export function LoginMethodTabs({ current }: LoginMethodTabsProps) {
  return (
    <div className={wrapper} role="tablist">
      {current === "password" && (
        <motion.span
          layoutId="login-method-pill"
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm"
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          aria-hidden
        />
      )}
      {current === "sms-otp" && (
        <motion.span
          layoutId="login-method-pill"
          className="absolute inset-y-1 right-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm"
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          aria-hidden
        />
      )}

      <Link
        href="/login"
        role="tab"
        aria-selected={current === "password"}
        className={cn(
          tabBase,
          current === "password" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
        )}
      >
        Password
      </Link>
      <Link
        href="/login/otp"
        role="tab"
        aria-selected={current === "sms-otp"}
        className={cn(
          tabBase,
          current === "sms-otp" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
        )}
      >
        SMS OTP
      </Link>
    </div>
  );
}
