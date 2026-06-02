# SiteStack ERP — Backend API Contract (Auth)

**Scope:** All backend HTTP calls made by the Web frontend's auth flows (register + sign-in).
**Audience:** Backend engineers connecting FastAPI endpoints to the existing frontend code.
**Last verified:** May 2026
**Companion doc:** [sign_in and register design.md](./sign_in%20and%20register%20design.md) — frontend architecture for the same surface.

This document enumerates every backend-touching call the frontend currently makes, pin-points the exact source file and line that issues it, and specifies the request/response contract the backend must satisfy.

---

## Quick reference

| # | Method | Path | Triggered by | File:Line |
|---|--------|------|--------------|-----------|
| 1 | `POST` | `/auth/login` | Sign-in form submit (via Auth.js `authorize()`) | `application/Web/src/lib/auth.ts:23` |
| 2 | `POST` | `/auth/register` | Register step 2 → method dialog choice | `application/Web/src/features/auth/services/auth.service.ts:22` |
| 3 | `POST` | `/auth/verify-otp` | Register step 3 OTP submit | `application/Web/src/features/auth/services/auth.service.ts:35` |
| 4 | `POST` | `/auth/resend-otp` | "Resend code" on register OTP screen | `application/Web/src/features/auth/services/auth.service.ts:46` |
| 5 | `POST` | `/auth/login/otp/request` | SMS-OTP login: phone submit (`/login/otp`) | `application/Web/src/features/auth/services/auth.service.ts:57` |
| 6 | `POST` | `/auth/login/otp/verify` | SMS-OTP login: code submit (`/login/otp/verify`) | `application/Web/src/features/auth/services/auth.service.ts:69` |

---

## Base configuration

- **Base URL:** `process.env.NEXT_PUBLIC_API_URL` — currently `http://localhost:8000/api` per `application/Web/.env.local`. So endpoint #2 is actually `POST http://localhost:8000/api/auth/register`.
- **Authentication:** httpOnly cookies. Axios is configured with `withCredentials: true` in `packages/api-client/src/index.ts:12`. Backend must set the session cookie with `HttpOnly; Secure; SameSite` and the proper CORS headers (`Access-Control-Allow-Credentials: true` + explicit `Access-Control-Allow-Origin`).
- **Content-Type:** `application/json` on every request.
- **Timeout:** 15s (`packages/api-client/src/index.ts:11`).
- **Global 401 handler:** `packages/api-client/src/index.ts:34-46` — any 401 redirects the browser to `/login`. Backend should return 401 only when the session is genuinely invalid; use other 4xx codes for business errors.

---

## 1. `POST /auth/login` *(currently a stub — needs wiring)*

**Frontend path:** Browser → Next.js Auth.js handler → `authorize()` callback → **your backend**.

- **Trigger:** `application/Web/src/features/auth/hooks/use-login.ts:25` calls `signIn("credentials", {...})`, which hits `/api/auth/callback/credentials` (Next.js owns this route via `app/api/auth/[...nextauth]/route.ts`), which invokes the `authorize` function in `application/Web/src/lib/auth.ts:13-30`.
- **Status today:** The `authorize` body is a placeholder that returns `null` — every login fails. The commented line at `lib/auth.ts:23` shows where to plug in the backend call.

**Request payload** (after Zod validation against `loginSchema`):
```ts
{
  identifier: string;   // username | email | phone — backend resolves
  password: string;
  rememberMe: boolean;  // true = 7-day session, false = browser-session cookie
}
```

**Expected response shape** (whatever `authorize` returns becomes the JWT `user`):
```ts
{
  id: string;
  email: string;
  role: "owner" | "admin" | "manager" | ...;  // UserRole from @sitestack/types
  // any other fields you want in session.user
}
```

**Error contract** *(see `use-login.ts:31-40`)*:
Frontend currently collapses all failures into `"wrong_password"` because Auth.js gives back only a generic code. To unlock the three UI states the form already renders, throw distinct errors from `authorize()`:

| Backend signal | UI result |
|---|---|
| Wrong credentials | `wrong_password` alert (attempts counter decrements) |
| Too many backend attempts | `locked` alert with countdown |
| Disabled user / company | `deactivated` view (replaces whole form) |

Frontend extension point is marked in `use-login.ts:36-39`.

---

## 2. `POST /auth/register`

- **Trigger:** `application/Web/src/features/auth/hooks/use-register.ts:24` → user clicks email/SMS in `VerifyMethodDialog` on `/register/account`.
- **Frontend caller:** `application/Web/src/features/auth/services/auth.service.ts:14-28`.

**Request payload:**
```ts
{
  fullName: string;
  email: string;            // validated email
  phoneNumber: string;      // 10-digit Indian mobile (regex /^[6-9]\d{9}$/)
  password: string;         // ≥8 chars, must contain upper, lower, digit
  company: {
    companyName: string;
    registeredAddress: string;
  };
  verificationMethod: "email" | "sms";
}
```
*Note:* `confirmPassword` and `agreeToTerms` are stripped client-side (`auth.service.ts:19-21`). Don't expect them.

**Expected response** (`RegisterResponse`):
```ts
{
  userId: string;
  email: string;
  otpExpiresAt: string;     // ISO 8601 — used by the verify screen later
}
```

**Side effect:** Backend must send the 6-digit OTP via the chosen channel (email or SMS) before returning. On success the frontend navigates to `/register/verify`.

---

## 3. `POST /auth/verify-otp`

- **Trigger:** `application/Web/src/features/auth/components/verify-otp-form.tsx:51` — user submits 6-digit code on `/register/verify`.
- **Frontend caller:** `application/Web/src/features/auth/services/auth.service.ts:30-39`.

**Request payload:**
```ts
{
  userId: string;   // currently the email (placeholder); swap to real userId once #2 returns one and is plumbed through the wizard store
  code: string;     // 6 digits, /^\d{6}$/
}
```

**Expected response** (`VerifyOtpResponse`):
```ts
{
  userId: string;
  verified: true;
}
```

**Error semantics:** Reject with any non-2xx for wrong/expired codes. Frontend treats every failure as a wrong-code attempt and clears the input. After 3 client-side attempts, the user is bounced back to `/register`.

**Known stub:** Frontend passes `account.email` instead of `userId` (`verify-otp-form.tsx:51`). When you wire register, return `userId` and plumb it through `useRegisterWizard` so the real ID is used here.

---

## 4. `POST /auth/resend-otp`

- **Trigger:** `application/Web/src/features/auth/components/verify-otp-form.tsx:71` — "Resend code" link on `/register/verify` (only enabled after a 60s cooldown).
- **Frontend caller:** `application/Web/src/features/auth/services/auth.service.ts:41-50`.

**Request payload:**
```ts
{
  userId: string;                       // see caveat in #3
  method: "email" | "sms";
}
```

**Expected response:**
```ts
{
  otpExpiresAt: string;   // ISO 8601
}
```

---

## 5. `POST /auth/login/otp/request` *(new — for SMS-OTP sign-in)*

- **Trigger:** `application/Web/src/features/auth/hooks/use-request-login-otp.ts:13` — phone submit on `/login/otp`.
- **Frontend caller:** `application/Web/src/features/auth/services/auth.service.ts:53-61`.

**Request payload:**
```ts
{
  phoneNumber: string;   // 10-digit Indian mobile, validated against loginOtpRequestSchema
}
```
*Note:* `rememberMe` from the form is **not** sent here — it's sent on the verify call (#6) instead. The request endpoint only needs the phone.

**Expected response** (`LoginOtpRequestResponse`):
```ts
{
  maskedPhone: string;   // display-safe — e.g. "+91 98765 ****10"
  otpExpiresAt: string;  // ISO 8601
}
```

**Behavior:** Backend must SMS the 6-digit OTP. Return success even when the phone isn't registered, to prevent user enumeration — but don't actually send the SMS in that case.

**Fallback:** If `maskedPhone` is absent, frontend masks via `maskPhoneIndian()` (`use-request-login-otp.ts:20-23`). Send the masked value from backend so it can localize/format independently.

---

## 6. `POST /auth/login/otp/verify` *(new — for SMS-OTP sign-in)*

- **Trigger:** `application/Web/src/features/auth/hooks/use-verify-login-otp.ts:14` — "Verify & sign in" button on `/login/otp/verify`.
- **Frontend caller:** `application/Web/src/features/auth/services/auth.service.ts:63-72`.

**Request payload:**
```ts
{
  phoneNumber: string;   // same number from step 5
  code: string;          // 6 digits
  rememberMe: boolean;   // 7-day session if true
}
```

**Expected response:**
```ts
{
  ok: true;
}
```

**Side effect required:** Set the session cookie (same as `/auth/login`) so the user is signed in on response. On success, frontend navigates to `/dashboard`.

**Error contract:** Reject with non-2xx for wrong/expired codes. Frontend currently surfaces this only as a toast — no inline alert yet (`use-verify-login-otp.ts:23-27`).

---

## Shared conventions backend must honor

| Concern | What to do | Reference |
|---|---|---|
| **Session cookie** | `Set-Cookie` with `HttpOnly; Secure; SameSite=Lax`. Lifetime: 7 days if `rememberMe=true`, browser-session otherwise. | All sign-in endpoints (#1, #6) |
| **CORS** | `Access-Control-Allow-Credentials: true`, explicit `Access-Control-Allow-Origin` (no wildcard) | All endpoints |
| **401 = session invalid only** | Frontend auto-redirects to `/login` on 401 — don't use 401 for business errors | All endpoints |
| **Field validation errors** | Return 400 with a body the frontend can toast (currently just `err.message`) — consider `{ message, fields?: Record<string, string> }` | All write endpoints |
| **Indian phone regex** | `/^[6-9]\d{9}$/` — 10 digits, starts with 6/7/8/9 | #2, #5, #6 |
| **OTP format** | 6 numeric digits, 5-min expiry per UI copy | #3, #4, #5, #6 |
| **Shared Zod source** | All payload shapes are defined in `packages/schemas/src/index.ts` — backend should depend on this package (or mirror it) so contracts can't drift | All endpoints |

---

## What's NOT yet called from the frontend

These flows exist in the UI but have no backend call wired:

- **Forgot password** — `/login/forgot` is a static "coming soon" card. When you build the reset flow, the likely endpoints will be `POST /auth/forgot/request` and `POST /auth/forgot/reset`.
- **Logout** — no UI yet. Auth.js will hit its own `/api/auth/signout` route; you'll need to clear the session cookie there.
- **Session refresh** — Auth.js JWT strategy keeps the session client-side; no backend roundtrip required unless you switch to database sessions.

---

**Document owner:** Frontend team
**Source of truth for shapes:** Always trust `packages/schemas/src/index.ts` over this document. If you spot a drift, update both.
