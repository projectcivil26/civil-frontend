"use client";

import { useCallback, useEffect, useState } from "react";

// Countdown timer for OTP resend cooldowns. Returns seconds left + a reset fn.
export function useResendTimer(initialSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const reset = useCallback(
    () => setSecondsLeft(initialSeconds),
    [initialSeconds]
  );

  return { secondsLeft, canResend: secondsLeft <= 0, reset };
}
