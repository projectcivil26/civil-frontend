// Shared Tailwind class tokens for the auth feature.
// Extracted because primaryButton / inputBase / errorText are used across the
// register form, login form, and OTP flows — Rule 7.1 (no long inline class
// strings) + Rule 12 (extract when reused 2+ times).

export const primaryButton =
  "h-11 w-full rounded-full bg-teal-500 text-base font-semibold text-white shadow-sm shadow-teal-500/30 hover:bg-teal-600 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButton =
  "h-11 w-full rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-60";

export const inputBase =
  "h-11 w-full rounded-lg border-gray-200 pl-10 text-sm focus-visible:border-teal-500 focus-visible:ring-teal-500";

// For inputs that need to surface a field-level error visually (red ring).
export const inputErrorRing =
  "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-300";

export const fieldIcon =
  "pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400";

export const errorText = "text-xs text-rose-500";

export const linkText = "font-semibold text-teal-600 hover:underline";

// Visual divider with text in the middle ("or").
export const dividerWithText =
  "relative flex items-center text-xs text-gray-400 before:mr-3 before:h-px before:flex-1 before:bg-gray-200 after:ml-3 after:h-px after:flex-1 after:bg-gray-200";
