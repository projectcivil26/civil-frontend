"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import type { LoginInput } from "../schema";
import { useLoginFlow } from "../store/login-flow.store";

// Outcome of the credentials sign-in attempt. We model only the cases the UI
// branches on. Anything else we don't yet handle gets surfaced as "wrong_password".
type LoginResult =
  | { ok: true }
  | { ok: false; reason: "wrong_password" | "locked" | "deactivated" };

export function useLogin() {
  const router = useRouter();
  const registerWrongPassword = useLoginFlow((s) => s.registerWrongPassword);
  const setLocked = useLoginFlow((s) => s.setLocked);
  const clearFailure = useLoginFlow((s) => s.clearFailure);

  return useMutation<LoginResult, Error, LoginInput>({
    mutationFn: async (input) => {
      const res = await signIn("credentials", {
        identifier: input.identifier,
        password: input.password,
        rememberMe: input.rememberMe ? "true" : "false",
        redirect: false,
      });

      if (!res) return { ok: false, reason: "wrong_password" };
      if (res.ok) return { ok: true };

      // Auth.js maps any thrown error in authorize() to a generic code.
      // Once the backend distinguishes locked/deactivated, plumb those through
      // here. For now everything non-ok is treated as a wrong-password attempt.
      return { ok: false, reason: "wrong_password" };
    },
    onSuccess: (result) => {
      if (result.ok) {
        clearFailure();
        toast.success("Signed in");
        // replace, not push: back-button shouldn't return to /login after success
        router.replace("/dashboard");
        return;
      }
      if (result.reason === "locked") {
        setLocked();
      } else {
        registerWrongPassword();
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });
}
