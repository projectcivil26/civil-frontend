"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface LoginErrorAlertProps {
  attemptsLeft: number;
}

// Inline red alert shown when a credential attempt is rejected. Mirrors the
// "Wrong code" alert from the register OTP verify form for visual consistency.
export function LoginErrorAlert({ attemptsLeft }: LoginErrorAlertProps) {
  const moreThanOne = attemptsLeft !== 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-rose-200 bg-rose-50 p-3"
      role="alert"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
        <AlertTriangle className="size-4" aria-hidden />
        Wrong password
      </div>
      <p className="mt-0.5 text-xs text-rose-600">
        {attemptsLeft} attempt{moreThanOne ? "s" : ""} left before account is
        locked.
      </p>
    </motion.div>
  );
}
