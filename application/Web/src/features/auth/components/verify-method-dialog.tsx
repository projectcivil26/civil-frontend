"use client";

import { Mail, Smartphone } from "lucide-react";
import type { VerificationMethod } from "@sitestack/schemas";
import {
  WarpDialog,
  WarpDialogContent,
} from "@/components/ui/warp-dialog";
import { maskEmail, maskPhoneIndian } from "@/lib/utils/mask";

interface VerifyMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  phoneNumber: string;
  onSelect: (method: VerificationMethod) => void;
  isLoading?: boolean;
}

const cardStyles =
  "relative w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8";
const optionBase =
  "flex items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-teal-500 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50";
const optionIcon = "rounded-full bg-teal-100 p-2 text-teal-600";

export function VerifyMethodDialog({
  open,
  onOpenChange,
  email,
  phoneNumber,
  onSelect,
  isLoading,
}: VerifyMethodDialogProps) {
  return (
    <WarpDialog open={open} onOpenChange={onOpenChange}>
      <WarpDialogContent>
        <div className={cardStyles}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">
              How would you like to verify?
            </h2>
            <p className="text-sm text-gray-500">
              Choose where we should send the 6-digit code.
            </p>
          </div>
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => onSelect("email")}
              disabled={isLoading}
              className={optionBase}
            >
              <div className={optionIcon}>
                <Mail className="size-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-xs text-gray-500">{maskEmail(email)}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onSelect("sms")}
              disabled={isLoading}
              className={optionBase}
            >
              <div className={optionIcon}>
                <Smartphone className="size-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">SMS</p>
                <p className="text-xs text-gray-500">
                  {maskPhoneIndian(phoneNumber)}
                </p>
              </div>
            </button>
          </div>
        </div>
      </WarpDialogContent>
    </WarpDialog>
  );
}
