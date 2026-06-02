import { apiClient } from "@/lib/api";
import type {
  CompanyInfoInput,
  VerificationMethod,
} from "@sitestack/schemas";
import type {
  LoginOtpRequestResponse,
  RegisterInput,
  RegisterResponse,
  VerifyOtpResponse,
} from "../types";

// API service layer — no React, no UI logic. Pure data calls.
export const authService = {
  register: async (
    account: RegisterInput,
    companyInfo: CompanyInfoInput,
    verificationMethod: VerificationMethod
  ): Promise<RegisterResponse> => {
    const { confirmPassword, agreeToTerms, ...accountPayload } = account;
    void confirmPassword;
    void agreeToTerms;
    const { data } = await apiClient.post<RegisterResponse>("/auth/register", {
      ...accountPayload,
      company: companyInfo,
      verificationMethod,
    });
    return data;
  },

  verifyOtp: async (
    userId: string,
    code: string
  ): Promise<VerifyOtpResponse> => {
    const { data } = await apiClient.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      { userId, code }
    );
    return data;
  },

  resendOtp: async (
    userId: string,
    method: VerificationMethod
  ): Promise<{ otpExpiresAt: string }> => {
    const { data } = await apiClient.post<{ otpExpiresAt: string }>(
      "/auth/resend-otp",
      { userId, method }
    );
    return data;
  },

  // ── SMS-OTP sign-in path ──
  requestLoginOtp: async (
    phoneNumber: string
  ): Promise<LoginOtpRequestResponse> => {
    const { data } = await apiClient.post<LoginOtpRequestResponse>(
      "/auth/login/otp/request",
      { phoneNumber }
    );
    return data;
  },

  verifyLoginOtp: async (
    phoneNumber: string,
    code: string,
    rememberMe: boolean
  ): Promise<{ ok: true }> => {
    const { data } = await apiClient.post<{ ok: true }>(
      "/auth/login/otp/verify",
      { phoneNumber, code, rememberMe }
    );
    return data;
  },
};
