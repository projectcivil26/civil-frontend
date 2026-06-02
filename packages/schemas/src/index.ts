// Shared Zod schemas — used by Web, Mobile, and Backend for validation
import { z } from "zod";

// ──────────────────────────────────────────────────────────────────────────
// Validation conventions
// ──────────────────────────────────────────────────────────────────────────
// - Text fields: .trim() before .min/.max so leading/trailing whitespace
//   never satisfies a min-length check.
// - Passwords + OTP codes: NEVER trimmed. Leading/trailing characters in a
//   password are legitimate input; trimming would silently corrupt them.
// - Max lengths: cap inputs to defend against accidental/malicious huge
//   payloads (server should also enforce; this is defense-in-depth).
//   254 = RFC 5321 email max; 128 = common bcrypt input ceiling.

// Unified sign-in: identifier may be a username, email, or phone — the backend
// resolves the type. Frontend only enforces non-empty, per industry practice.
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your username, email or phone")
    .max(254, "That doesn't look like a valid identifier"),
  password: z
    .string()
    .min(1, "Enter your password")
    .max(128, "Password is too long"),
  rememberMe: z.boolean(),
});

// Step 1 of SMS-OTP sign-in: prove ownership of a registered phone.
export const loginOtpRequestSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  rememberMe: z.boolean(),
});

// Step 2 of SMS-OTP sign-in: verify the 6-digit code.
export const loginOtpVerifySchema = z.object({
  phoneNumber: z.string().trim().regex(/^[6-9]\d{9}$/),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
  rememberMe: z.boolean(),
});

export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
  registeredAddress: z
    .string()
    .trim()
    .min(10, "Please enter the full registered office address")
    .max(300, "Address is too long"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name is too long"),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(254, "Email is too long"),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().max(128),
    agreeToTerms: z
      .boolean()
      .refine((v) => v === true, "You must agree to the Terms of Service"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const verificationMethodSchema = z.enum(["email", "sms"]);

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(120),
  code: z.string().trim().min(1, "Project code is required").max(20),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().positive("Budget must be a positive number"),
  managerId: z.string().min(1, "Project manager is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginOtpRequestInput = z.infer<typeof loginOtpRequestSchema>;
export type LoginOtpVerifyInput = z.infer<typeof loginOtpVerifySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompanyInfoInput = z.infer<typeof companyInfoSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type VerificationMethod = z.infer<typeof verificationMethodSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
