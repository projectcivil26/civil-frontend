"use client";

import Link from "next/link";
import { ArrowLeft, Ban, Building2 } from "lucide-react";
import { motion } from "motion/react";

import { useLoginFlow } from "../store/login-flow.store";
import { linkText } from "../styles";

// Full-card replacement shown when the backend returns a deactivated-account
// response. The user can read the offending company + identifier and bounce
// back to the sign-in screen.
export function AccountDeactivatedView() {
  const deactivated = useLoginFlow((s) => s.deactivated);
  const clearFailure = useLoginFlow((s) => s.clearFailure);

  if (!deactivated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Account deactivated</h1>
      </header>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-2 text-gray-500 shadow-sm">
            <Ban className="size-4" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              This account has been deactivated.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Please contact your company administrator if you believe this is
              in error.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
            <Building2 className="size-4" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {deactivated.companyName}
            </p>
            <p className="text-xs text-gray-500">{deactivated.identifier}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          onClick={() => clearFailure()}
          className={`${linkText} inline-flex items-center gap-1.5 text-sm`}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}
