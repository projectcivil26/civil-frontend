"use client";

import { Lock } from "lucide-react";
import { motion } from "motion/react";

import { useLoginFlow } from "../store/login-flow.store";
import { useLockoutCountdown } from "../hooks/use-lockout-countdown";

// Alert shown after the user has exhausted their wrong-password attempts.
// Reads `lockedUntil` from the store, ticks a countdown, and clears the
// lockout when the timer reaches zero.
export function AccountLockedAlert() {
  const lockedUntil = useLoginFlow((s) => s.lockedUntil);
  const clearFailure = useLoginFlow((s) => s.clearFailure);
  const { formatted, expired } = useLockoutCountdown(lockedUntil, clearFailure);

  if (!lockedUntil || expired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-rose-200 bg-rose-50 p-3"
      role="alert"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
        <Lock className="size-4" aria-hidden />
        Too many failed attempts
      </div>
      <p className="mt-0.5 text-xs text-rose-600">
        For your security, this account is locked. Try again in{" "}
        <span className="font-semibold tabular-nums">{formatted}</span>.
      </p>
    </motion.div>
  );
}
