"use client";

import { useEffect, useState } from "react";

// Returns a formatted mm:ss countdown until `lockedUntil` (epoch ms).
// `onExpire` fires once when the countdown reaches zero so callers can
// clear their locked-state from the store without polling.
export function useLockoutCountdown(
  lockedUntil: number | null,
  onExpire?: () => void,
) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  if (!lockedUntil) {
    return { remainingSeconds: 0, formatted: "00:00", expired: true };
  }

  const remainingMs = Math.max(0, lockedUntil - now);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (remainingMs === 0 && onExpire) onExpire();

  return { remainingSeconds, formatted, expired: remainingMs === 0 };
}
