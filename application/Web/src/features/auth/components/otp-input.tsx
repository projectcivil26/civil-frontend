"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

const boxBase =
  "h-14 w-12 rounded-xl border-2 bg-white text-center text-2xl font-bold transition-colors focus:outline-none";

// Reusable 6-digit OTP input. Handles paste, backspace, arrow nav.
export function OtpInput({
  length = 6,
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value
    .split("")
    .concat(Array(Math.max(0, length - value.length)).fill(""));

  const focusBox = (i: number) => {
    refs.current[i]?.focus();
    refs.current[i]?.select();
  };

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = digits.slice();
    next[i] = digit;
    onChange(next.join("").slice(0, length));
    if (i < length - 1) focusBox(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = digits.slice();
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusBox(i - 1);
    } else if (e.key === "ArrowRight" && i < length - 1) {
      focusBox(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (pasted) {
      onChange(pasted);
      focusBox(Math.min(pasted.length, length - 1));
    }
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(i, e.target.value)
          }
          onKeyDown={(e) => handleKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            boxBase,
            error
              ? "border-rose-400 text-rose-600 focus:border-rose-500"
              : d
                ? "border-teal-500 text-gray-900"
                : "border-gray-200 text-gray-900 focus:border-teal-500"
          )}
        />
      ))}
    </div>
  );
}
