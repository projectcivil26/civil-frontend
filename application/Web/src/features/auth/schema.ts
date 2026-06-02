// Feature-local re-exports of the shared schemas.
// Lets feature code import from "@/features/auth/schema" instead of the shared package directly.
export {
  loginSchema,
  loginOtpRequestSchema,
  loginOtpVerifySchema,
  registerSchema,
  type LoginInput,
  type LoginOtpRequestInput,
  type LoginOtpVerifyInput,
  type RegisterInput,
} from "@sitestack/schemas";
