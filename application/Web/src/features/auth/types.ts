// Feature-local types for the auth domain.
// Re-export the shared inputs so feature code never reaches into @sitestack/schemas directly.
export type {
  LoginInput,
  LoginOtpRequestInput,
  LoginOtpVerifyInput,
  RegisterInput,
  VerifyOtpInput,
  VerificationMethod,
} from "@sitestack/schemas";

export interface RegisterResponse {
  userId: string;
  email: string;
  // The backend issues a 6-digit OTP; verification happens on the next step
  otpExpiresAt: string;
}

export interface VerifyOtpResponse {
  userId: string;
  verified: true;
}

// Possible outcomes when a sign-in attempt is rejected. Backend may extend
// this list; treat unknown values as "wrong_password" by default.
export type LoginFailureReason =
  | "wrong_password"
  | "locked"
  | "deactivated";

export interface LoginOtpRequestResponse {
  // Masked phone the OTP was actually sent to (e.g. "+91 98765 ****10")
  maskedPhone: string;
  otpExpiresAt: string;
}

// Snapshot used by the deactivated-account view.
export interface DeactivatedAccountInfo {
  companyName: string;
  identifier: string;
}
