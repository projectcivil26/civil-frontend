# SiteStack ERP — Sign-In & Register Design Reference

**Scope:** Web only (`application/Web`). Mobile (React Native) is out of scope for this document.
**Audience:** Frontend engineers picking up the auth flows for the first time.
**Last verified:** May 2026

This document describes **every file** that contributes to the registration and sign-in experiences, the **code flow** between them, the **industry standards** the implementation honors, and the **current visual design**. Treat it as the map you read once before opening any of these files.

---

## Table of Contents

1. [TL;DR (one-screen mental model)](#1-tldr)
2. [Folder map](#2-folder-map)
3. [Route ↔ Page ↔ Component mapping](#3-route--page--component-mapping)
4. [Code flow — Registration](#4-code-flow--registration)
5. [Code flow — Sign-In (Password)](#5-code-flow--sign-in-password)
6. [Code flow — Sign-In (SMS OTP)](#6-code-flow--sign-in-sms-otp)
7. [Code flow — Failure states](#7-code-flow--failure-states)
8. [File-by-file reference](#8-file-by-file-reference)
9. [Design system & visual tokens](#9-design-system--visual-tokens)
10. [Industry standards honored](#10-industry-standards-honored)
11. [Known stubs / TODOs / hand-off notes](#11-known-stubs--todos--hand-off-notes)

---

## 1. TL;DR

- **Two flows live under `app/(auth)/`** — `/register/*` (3-step wizard) and `/login/*` (sign-in + SMS OTP path + forgot-password stub).
- **All real form/UI logic lives in `features/auth/`** — components, hooks, services, store, schema, types, styles. Per the project's Rules doc (Rule 2), pages stay thin and feature folders own the work.
- **Validation = Zod** (Rule 1.3, 8). Schemas live in `packages/schemas` so the backend (FastAPI) and frontend share them. Feature-local re-exports in `features/auth/schema.ts` let app code import from one place.
- **Server data = TanStack Query** (Rule 4). Each mutation is wrapped in a `use*` hook that calls a method on the centralized `authService` (Rule 5).
- **Client state = Zustand**, only where it must persist across pages — the 3-step register wizard and the multi-screen sign-in flow each have their own store.
- **Auth runtime = Auth.js v5 (`next-auth@beta`)** with the Credentials provider. The current `authorize()` callback is a placeholder (returns `null`); plumbing the real backend is one line of change.
- **Motion = `motion/react` (Framer Motion v12)** — used in the brand-panel `FloatingPaths`, the sliding pill on `LoginMethodTabs`, the inline alerts, and the OTP "warp" dialog.

---

## 2. Folder map

```text
application/Web/src/
├── app/
│   └── (auth)/                              ← Route group; shared bg shell
│       ├── layout.tsx                         Sets bg-brand-bg for all auth routes
│       ├── login/
│       │   ├── page.tsx                       /login              — password sign-in
│       │   ├── forgot/page.tsx                /login/forgot       — placeholder
│       │   └── otp/
│       │       ├── page.tsx                   /login/otp          — phone entry
│       │       └── verify/page.tsx            /login/otp/verify   — OTP entry
│       └── register/
│           ├── page.tsx                       /register           — Step 1: company info
│           ├── account/page.tsx               /register/account   — Step 2: personal account
│           └── verify/page.tsx                /register/verify    — Step 3: OTP verification
│
├── features/auth/                            ← All auth domain logic lives here
│   ├── schema.ts                              Re-exports Zod schemas from packages/schemas
│   ├── types.ts                               Re-exports + auth-specific response types
│   ├── styles.ts                              Shared Tailwind class tokens (NEW)
│   ├── components/
│   │   ├── auth-brand-panel.tsx               Left gradient panel w/ FloatingPaths + optional TIP
│   │   ├── floating-paths.tsx                 Animated SVG paths on the brand panel
│   │   ├── wizard-stepper.tsx                 "Step 2 of 3" progress bar (register only)
│   │   ├── company-info-form.tsx              Register step 1 form
│   │   ├── register-form.tsx                  Register step 2 form
│   │   ├── verify-otp-form.tsx                Register step 3 form
│   │   ├── verify-method-dialog.tsx           "Email or SMS?" dialog before OTP send
│   │   ├── otp-input.tsx                      Reusable 6-box OTP component
│   │   ├── login-form.tsx                     Main sign-in form (password tab)
│   │   ├── login-method-tabs.tsx              Password / SMS-OTP pill toggle (links between routes)
│   │   ├── login-error-alert.tsx              "Wrong password — N attempts left" inline alert
│   │   ├── account-locked-alert.tsx           "Try again in mm:ss" with live countdown
│   │   ├── account-deactivated-view.tsx       Full-card alt view for deactivated accounts
│   │   ├── login-otp-request-form.tsx         Phone entry at /login/otp
│   │   └── login-otp-verify-form.tsx          6-digit code entry at /login/otp/verify
│   ├── hooks/
│   │   ├── use-register.ts                    POST /auth/register
│   │   ├── use-verify-otp.ts                  POST /auth/verify-otp (register flow)
│   │   ├── use-resend-timer.ts                60-second countdown for resend buttons
│   │   ├── use-login.ts                       Wraps Auth.js signIn("credentials", …)
│   │   ├── use-request-login-otp.ts           POST /auth/login/otp/request
│   │   ├── use-verify-login-otp.ts            POST /auth/login/otp/verify
│   │   └── use-lockout-countdown.ts           Ticking mm:ss for lockout banner
│   ├── services/
│   │   └── auth.service.ts                    All HTTP calls go through here (no React)
│   └── store/
│       ├── auth.store.ts                      Logged-in user role/userId (global)
│       ├── register-wizard.store.ts           Persists 3-step register data (sessionStorage)
│       └── login-flow.store.ts                Sign-in attempts, lockout, OTP phone, deactivated info
│
├── components/
│   ├── shared/
│   │   ├── auth-card.tsx                      Rounded white panel (used by every auth subpage)
│   │   └── site-stack-logo.tsx                Brand mark (three gold blocks + wordmark)
│   └── ui/                                    shadcn/ui primitives (Button, Input, Label, …)
│
└── lib/
    ├── auth.ts                                Auth.js v5 config (Credentials provider + JWT)
    └── utils/
        ├── index.ts                           cn() class-merging helper
        └── mask.ts                            maskEmail / maskPhoneIndian

packages/schemas/src/index.ts                  ← Shared Zod source of truth (frontend + backend)
```

---

## 3. Route ↔ Page ↔ Component mapping

| URL | Page file | Top-level UI |
| --- | --- | --- |
| `/register` | `app/(auth)/register/page.tsx` | `AuthBrandPanel` + `WizardStepper` + `CompanyInfoForm` |
| `/register/account` | `app/(auth)/register/account/page.tsx` | `AuthBrandPanel` + `WizardStepper` + `RegisterForm` (→ opens `VerifyMethodDialog`) |
| `/register/verify` | `app/(auth)/register/verify/page.tsx` | Centered card with `VerifyOtpForm` (no brand panel — focused action) |
| `/login` | `app/(auth)/login/page.tsx` | `AuthBrandPanel(title=Welcome back, tip=…)` + `LoginForm` |
| `/login/otp` | `app/(auth)/login/otp/page.tsx` | Same brand panel + `LoginOtpRequestForm` |
| `/login/otp/verify` | `app/(auth)/login/otp/verify/page.tsx` | Brand panel + `LoginOtpVerifyForm` |
| `/login/forgot` | `app/(auth)/login/forgot/page.tsx` | Brand panel + static "coming soon" card |

> **Layout convention:** every auth page is a two-column `lg:grid-cols-2` shell — `AuthBrandPanel` on the left (hidden below `lg`), `AuthCard` on the right. The exception is `/register/verify`, which is intentionally a single centered card to keep the user focused on the OTP entry.

---

## 4. Code flow — Registration

```
/register                /register/account               /register/verify
─────────────            ────────────────────            ───────────────────
CompanyInfoForm  ─store→ RegisterForm  ─dialog→ VerifyMethodDialog
                              │                       │
                              │                       └─ user picks email|sms
                              │                                  │
                              ▼                                  ▼
                         useRegister  ───────────────→  authService.register()
                                                                │
                                                                ▼
                                                          POST /auth/register
                                                                │
                                                       on success: router.push(/register/verify)
                                                                │
                                                                ▼
                                                          VerifyOtpForm
                                                          ├─ OtpInput
                                                          ├─ useResendTimer
                                                          └─ authService.verifyOtp()  →  router.push(/dashboard)
```

**Data carriers between routes**

| Carrier | Lives in | What it holds |
| --- | --- | --- |
| `useRegisterWizard` (Zustand + sessionStorage) | `store/register-wizard.store.ts` | `companyInfo`, `account` (stub), `verification` (method + masked destination) |
| URL navigation | `useRouter` | Step-to-step transitions only |

**Why sessionStorage:** survives an accidental refresh mid-flow but auto-clears when the tab closes (Rule 4 — global state only when strictly needed; persisted only as long as required).

---

## 5. Code flow — Sign-In (Password)

```
/login
─────────
LoginForm
├─ LoginMethodTabs(current=password)       ← <Link>s to /login or /login/otp
├─ <form>
│   ├─ identifier  (RHF + Zod permissive)
│   ├─ password    (Show/Hide toggle, lock icon)
│   ├─ Forgot password? → /login/forgot
│   └─ rememberMe  (default: checked)
├─ Sign in button  ─click→  useLogin.mutate()
│                                │
│                                ▼
│                       signIn("credentials", { identifier, password, rememberMe, redirect:false })
│                                │
│                       ┌────────┴─────────┐
│                   res.ok                res.ok = false
│                       │                       │
│                       ▼                       ▼
│              router.push(/dashboard)   loginFlowStore.registerWrongPassword()
│              toast.success            (decrements attemptsLeft, sets failureReason)
│
└─ Sign in with SMS OTP → /login/otp   (Link in dividerWithText section)
```

**State branches the form renders**

| `failureReason` | What `LoginForm` renders |
| --- | --- |
| `null` | Normal form |
| `"wrong_password"` | Form + `LoginErrorAlert` at top + red ring on password |
| `"locked"` | Form disabled (inputs + button) + `AccountLockedAlert` ticking mm:ss |
| `"deactivated"` | **Entire form replaced** by `AccountDeactivatedView` |

The wrong-password and locked alerts use `AnimatePresence` from `motion/react` for slide-in/out continuity.

---

## 6. Code flow — Sign-In (SMS OTP)

```
/login/otp                            /login/otp/verify
─────────────                         ────────────────────
LoginOtpRequestForm                   LoginOtpVerifyForm
├─ LoginMethodTabs(current=sms-otp)   ├─ guard: if !otpPhoneNumber → router.replace(/login/otp)
├─ phone input (IN +91 prefix)        ├─ OtpInput (6 boxes, paste-friendly)
└─ Send code → useRequestLoginOtp     ├─ Verify & sign in → useVerifyLoginOtp
                  │                                          │
                  ▼                                          ▼
       authService.requestLoginOtp(phone)         authService.verifyLoginOtp(phone, code, rememberMe)
                  │                                          │
       on success:                                  on success:
       ├─ store.setOtpPhone(phone, masked)         ├─ store.clearOtpFlow() + clearFailure()
       └─ router.push(/login/otp/verify)           └─ router.push(/dashboard)
```

**Data carrier between the two routes:** `useLoginFlow` Zustand store holds `otpPhoneNumber` (raw) and `otpMaskedPhone` (display-safe). The verify form reads these; if absent it bounces back to `/login/otp`.

---

## 7. Code flow — Failure states

```
useLogin.onSuccess(result)
       │
       ├─ result.ok = true            →  clearFailure() + push(/dashboard)
       │
       └─ result.ok = false
              │
              ├─ reason = "locked"      → store.setLocked()            → AccountLockedAlert
              ├─ reason = "deactivated" → store.setDeactivated(info)   → AccountDeactivatedView
              └─ reason = "wrong_password"  (default for unknown)
                     │
                     ▼
                  store.registerWrongPassword()
                     │
                     ├─ attemptsLeft -= 1
                     ├─ if attemptsLeft > 0  → failureReason = "wrong_password"
                     └─ if attemptsLeft = 0  → failureReason = "locked", lockedUntil = now + 15min
                                                                  │
                                                                  ▼
                                                         useLockoutCountdown(lockedUntil, onExpire)
                                                                  │
                                                                  └─ on expire: clearFailure()
```

**Where to add new failure reasons:**

1. Extend `LoginFailureReason` union in `features/auth/types.ts`.
2. Branch on it in `useLogin.onSuccess` to call the right store action.
3. Render a new alert component, or branch in `login-form.tsx`'s state block.

---

## 8. File-by-file reference

> Each entry: **what it is**, **what it exports**, **what it depends on**. Read top-to-bottom or jump via the [Folder map](#2-folder-map).

### 8.1 Shared package — `packages/schemas/src/index.ts`

The single source of truth for **all** auth-related Zod schemas, shared with the FastAPI backend.

| Export | Purpose |
| --- | --- |
| `loginSchema` | `{ identifier, password, rememberMe }` — permissive identifier (non-empty); backend resolves type |
| `loginOtpRequestSchema` | `{ phoneNumber, rememberMe }` — 10-digit Indian mobile regex |
| `loginOtpVerifySchema` | `{ phoneNumber, code, rememberMe }` — 6-digit numeric code |
| `companyInfoSchema` | `{ companyName, registeredAddress }` (register step 1) |
| `registerSchema` | full account schema with cross-field password-confirm refinement |
| `verifyOtpSchema` | `{ code }` — 6-digit code (register step 3) |
| `verificationMethodSchema` | `'email' | 'sms'` enum |

Also exports `*Input` type aliases via `z.infer<>`.

---

### 8.2 Auth route layout — `app/(auth)/layout.tsx`

Background-only shell — wraps every auth subpage in `<div className="min-h-screen bg-brand-bg">`. No logic, no header.

### 8.3 Login pages

#### `app/(auth)/login/page.tsx`
Server component. Renders `AuthBrandPanel(title="Welcome back.", description=…, tip=…)` + `AuthCard > LoginForm`.

#### `app/(auth)/login/otp/page.tsx`
Same shell, with `LoginOtpRequestForm` inside the card and the same TIP block on the brand panel.

#### `app/(auth)/login/otp/verify/page.tsx`
Same shell, with `LoginOtpVerifyForm`. TIP omitted because the user is mid-action.

#### `app/(auth)/login/forgot/page.tsx`
Placeholder card pointing users to `support@sitestack.app`. Exists so the `Forgot password?` link doesn't 404.

### 8.4 Register pages

#### `app/(auth)/register/page.tsx`
Step 1. Shell + `WizardStepper(current=1, total=3)` + `CompanyInfoForm`.

#### `app/(auth)/register/account/page.tsx`
Step 2. Shell + `WizardStepper(current=2)` + `RegisterForm`.

#### `app/(auth)/register/verify/page.tsx`
Step 3. **Centered single-column** layout (no brand panel) + `VerifyOtpForm`. Different layout because the OTP step deserves user focus.

### 8.5 Feature — schemas / types / styles

#### `features/auth/schema.ts`
Re-exports `loginSchema`, `loginOtpRequestSchema`, `loginOtpVerifySchema`, `registerSchema` (+ types) from `@sitestack/schemas`. **App code should import from here**, not the shared package directly. Per Rule 2 — features own their boundaries.

#### `features/auth/types.ts`
Re-exports the `*Input` types plus auth-specific response types:
- `RegisterResponse`, `VerifyOtpResponse`
- `LoginFailureReason` = `'wrong_password' | 'locked' | 'deactivated'`
- `LoginOtpRequestResponse` = `{ maskedPhone, otpExpiresAt }`
- `DeactivatedAccountInfo` = `{ companyName, identifier }`

#### `features/auth/styles.ts`
Tailwind class tokens shared across the auth feature. Exists because Rule 7.1 forbids long inline class strings and Rule 12 says extract at 2+ uses.

| Token | Used by |
| --- | --- |
| `primaryButton` | Sign in, Send code, Verify, Create account |
| `secondaryButton` | "Sign in with SMS OTP" alt CTA |
| `inputBase` | Every text input in the auth feature |
| `inputErrorRing` | Password input when `wrong_password` |
| `fieldIcon` | Left-aligned input icons |
| `errorText` | Inline field error message |
| `linkText` | All teal-600 inline links |
| `dividerWithText` | "or" separator between primary and alt CTAs |

> **Note:** `register-form.tsx`, `company-info-form.tsx`, and `verify-otp-form.tsx` predate `styles.ts` and still keep their tokens inline. Safe to refactor when those files are next touched.

### 8.6 Feature — components

#### `auth-brand-panel.tsx`
Server component. Left-side gradient panel used by both `/register/*` and `/login/*`. Three props, all optional:
- `title` — top-right headline (default = register copy)
- `description` — bottom-left supporting text (default = register copy)
- `tip` — `{ eyebrow, body }` for the floating TIP box (used by `/login`)

Composes `SiteStackLogo` + two `FloatingPaths` instances (the only client island in here).

#### `floating-paths.tsx`
36 layered SVG curves per direction with `motion.path` animating `pathLength`, `opacity`, and `pathOffset` on infinite linear loops. Decorative — no interactivity.

#### `wizard-stepper.tsx`
Pure presentation. Renders `Step X of Y · label` + a teal progress bar. Register-only.

#### `company-info-form.tsx` (register step 1)
- React Hook Form + `zodResolver(companyInfoSchema)`
- On submit: `useRegisterWizard.setCompanyInfo(values)` → `router.push("/register/account")`

#### `register-form.tsx` (register step 2)
- React Hook Form + `zodResolver(registerSchema)`
- Reads `companyInfo` from `useRegisterWizard`; if missing → bounces back to `/register`
- On submit: opens `VerifyMethodDialog`, **not** the API call directly
- On dialog choice: writes account + verification stubs to store, calls `useRegister.mutate()`

#### `verify-method-dialog.tsx`
Two cards: Email (masked) and SMS (masked). Calls `onSelect(method)` upward. Built on the custom `WarpDialog` UI primitive.

#### `verify-otp-form.tsx` (register step 3)
- Reads `account` + `verification` from `useRegisterWizard`; bounces to `/register` if absent
- 6-box OTP via `<OtpInput>`
- Tracks 3 local attempts; on exhaustion toasts + bounces to `/register`
- On success → `router.push("/dashboard")`
- Resend uses `useResendTimer(60)`

#### `otp-input.tsx`
Generic 6-box OTP component (`length` prop default 6). Handles paste, backspace, arrow nav, autocomplete `one-time-code`. **Reused by both** register and login OTP verify forms.

#### `login-form.tsx` (sign-in main form)
- RHF + `zodResolver(loginSchema)`
- Renders one of: normal form / form + `LoginErrorAlert` / form + `AccountLockedAlert` (disabled) / `AccountDeactivatedView` (full replacement)
- On every keystroke clears `failureReason` so the red state doesn't outlive the user's correction
- "Sign in" → `useLogin.mutate()`
- Has alt CTA `<Link href="/login/otp">` with `Smartphone` icon under an `or` divider

#### `login-method-tabs.tsx`
Pill toggle with two `<Link>` children. The active pill is a `motion.span` with `layoutId="login-method-pill"` so navigating between `/login` and `/login/otp` would animate the pill across — if React unmounted/remounted gracefully. Today the sliding effect kicks in on intra-render state changes; cross-route animation is a future polish.

#### `login-error-alert.tsx`
Animated red banner: "Wrong password — N attempts left before account is locked." Pluralizes correctly. Slides in with `motion`.

#### `account-locked-alert.tsx`
Reads `lockedUntil` from `useLoginFlow`, drives `useLockoutCountdown`, renders "Try again in mm:ss". Calls `clearFailure` once when the countdown hits zero.

#### `account-deactivated-view.tsx`
Full-card replacement (not a banner). Reads `deactivated: { companyName, identifier }` from `useLoginFlow` and shows the panel + a "← Back to sign in" link that calls `clearFailure()`.

#### `login-otp-request-form.tsx` (`/login/otp`)
- RHF + `zodResolver(loginOtpRequestSchema)`
- Phone input has a left lock icon, an `IN +91` prefix block, and a 10-digit numeric `maxLength`
- On submit: `useRequestLoginOtp.mutate({ phoneNumber, rememberMe: true })`
- Back link to `/login` for password sign-in

#### `login-otp-verify-form.tsx` (`/login/otp/verify`)
- Guards: if `otpPhoneNumber` missing → `router.replace("/login/otp")`
- 6-box `<OtpInput>` + `useResendTimer(60)` for the resend cooldown
- "Verify & sign in" → `useVerifyLoginOtp.mutate(...)`; on `onError` shows red state and clears input
- "Use a different number" → `router.push("/login/otp")`

### 8.7 Feature — hooks

All `use*` hooks are thin TanStack Query wrappers around `authService` methods (Rule 5). They expose `mutate`, `mutateAsync`, `isPending`, etc.

| Hook | Mutation | Side effects on success |
| --- | --- | --- |
| `use-register.ts` | `authService.register(account, companyInfo, method)` | toast + `router.push("/register/verify")` |
| `use-verify-otp.ts` *(register flow)* | `authService.verifyOtp(userId, code)` | toast + `router.push("/dashboard")` |
| `use-login.ts` | `signIn("credentials", …)` from `next-auth/react` | `router.push("/dashboard")` on `res.ok`; on failure delegates to `useLoginFlow` |
| `use-request-login-otp.ts` | `authService.requestLoginOtp(phone)` | `store.setOtpPhone(...)` + `router.push("/login/otp/verify")` |
| `use-verify-login-otp.ts` | `authService.verifyLoginOtp(phone, code, rememberMe)` | `clearOtpFlow()` + `clearFailure()` + `router.push("/dashboard")` |
| `use-resend-timer.ts` | (not a mutation) | Returns `{ secondsLeft, canResend, reset }` |
| `use-lockout-countdown.ts` | (not a mutation) | Returns `{ formatted, remainingSeconds, expired }`; fires `onExpire` once |

### 8.8 Feature — services

#### `services/auth.service.ts`

The **only** place that talks HTTP in this feature (Rule 5). React-free, easily unit-testable. Methods:
- `register(account, companyInfo, method)` → `POST /auth/register`
- `verifyOtp(userId, code)` → `POST /auth/verify-otp`
- `resendOtp(userId, method)` → `POST /auth/resend-otp`
- `requestLoginOtp(phoneNumber)` → `POST /auth/login/otp/request`
- `verifyLoginOtp(phoneNumber, code, rememberMe)` → `POST /auth/login/otp/verify`

> **No `login()` here.** Auth.js owns the password sign-in via the Credentials provider; calling `signIn("credentials", …)` triggers `authorize()` in `lib/auth.ts`.

### 8.9 Feature — stores

#### `store/auth.store.ts` (global)
Tiny Zustand store with `role: UserRole | null` + `userId`. Used post-login by the dashboard. Not touched by the auth flows themselves.

#### `store/register-wizard.store.ts`
Wizard state for the 3-step register flow. **Persisted to `sessionStorage`** via `zustand/middleware`'s `persist + createJSONStorage`. Survives refresh, clears on tab close. Keys: `companyInfo`, `account`, `verification`.

#### `store/login-flow.store.ts`
In-memory only (no persistence — sensitive state). Holds:
- `failureReason`, `attemptsLeft`, `lockedUntil`, `deactivated`
- `otpPhoneNumber`, `otpMaskedPhone`

Constants exported alongside:
- `LOGIN_MAX_ATTEMPTS = 3`
- `LOGIN_LOCKOUT_SECONDS = 15 * 60` *(15-minute lockout)*

Actions: `registerWrongPassword()`, `setLocked()`, `setDeactivated()`, `clearFailure()`, `setOtpPhone()`, `clearOtpFlow()`, `reset()`.

### 8.10 Shared components

#### `components/shared/auth-card.tsx`
Rounded white panel with subtle border + shadow. Every auth subpage wraps its content in this — the visual constant of the auth surface.

#### `components/shared/site-stack-logo.tsx`
Brand mark — three stacked gold blocks tapering upward. `showWordmark={false}` for icon-only use (OTP screens).

### 8.11 lib

#### `lib/auth.ts`
Auth.js v5 setup. Exports `{ handlers, signIn, signOut, auth }`.

- `providers: [Credentials({ credentials: { identifier, password, rememberMe }, authorize })]`
- `authorize()` normalizes `rememberMe` (string → bool), validates with `loginSchema.safeParse`, then **returns `null`** (stub). Replace with your backend call to enable real sign-in.
- `session.strategy = 'jwt'`
- `pages.signIn = '/login'`
- JWT/session callbacks copy `role` from user → token → session

#### `lib/utils/index.ts`
Single export `cn(...inputs)` = `twMerge(clsx(inputs))`.

#### `lib/utils/mask.ts`
`maskEmail(email)` and `maskPhoneIndian(phone)`. Used by the verify-method dialog and the login OTP flow when the backend doesn't send back its own masked value.

---

## 9. Design system & visual tokens

### Layout
- **Two-column shell** — `grid min-h-screen w-full lg:grid-cols-2`
- Brand panel: `hidden lg:flex`, full-bleed gradient `from-#0F2C4E via-#155B6B to-#0FA9A4`
- Form column: `bg-brand-bg` (light gray)
- Form card: `AuthCard` — `max-w-md`, rounded-2xl, white, subtle border + shadow

### Color (`globals.css` tokens)
- `--brand-navy: #1C3A5E` — primary brand
- `--brand-gold: #C9974A` — accents, logo
- `--brand-bg: #F5F5F7` — page bg behind cards
- Status: success `#10B981`, warning `#F59E0B`, danger `#F43F5E`
- Interaction: `teal-500/600` for buttons + links (rounded-full pills, primary CTA)
- Errors: `rose-200/300/500/600/700` for alerts and field rings

### Typography
- Headings: `text-2xl font-bold text-gray-900` (cards), `text-3xl/4xl font-bold` (brand panel)
- Body: `text-sm text-gray-500/700`
- Wordmark: lowercase `site stack` in the logo

### Buttons
- Primary: `h-11 w-full rounded-full bg-teal-500 …` — used for Sign in / Create account / Verify
- Secondary outline: `h-11 w-full rounded-full border bg-white text-gray-700 …` — used for "Sign in with SMS OTP"

### Inputs
- All: `h-11 rounded-lg border-gray-200 pl-10 text-sm`, teal focus ring
- Phone: prefixed by `IN +91` block inside the input
- Password: lock icon left, `Show`/`Hide` text right
- OTP: 6 individual boxes via `<OtpInput>` — fill = teal border, error = rose border

### Motion (all via `motion/react`)
- `FloatingPaths` — 36 layered SVG curves, infinite linear loop
- `LoginMethodTabs` — `layoutId="login-method-pill"` for sliding pill on tab change
- `LoginErrorAlert` / `AccountLockedAlert` / `AccountDeactivatedView` — slide-in via `initial/animate/exit` (wrapped in `AnimatePresence` inside `LoginForm`)
- `WarpDialog` — custom warp-effect modal (used by `VerifyMethodDialog`)

---

## 10. Industry standards honored

Mapping to the project's **Rules doc** (`application/Rules/rules.md`):

| Rule | Where it shows up |
| --- | --- |
| **1.1 Server-first** | Every `page.tsx` is a server component; `"use client"` only on interactive form/animation files |
| **1.2 Separation of concerns** | UI (`components/`) ↔ logic (`hooks/`) ↔ HTTP (`services/`) ↔ validation (`schema.ts`). No HTTP in components, no validation logic in components |
| **1.3 Type safety, no `any`** | All forms typed via `z.infer<>`; `LoginResult` is a discriminated union; no `any` |
| **2 Feature-driven folders** | All auth logic lives under `features/auth/{components,hooks,services,store}` |
| **3.1 Dumb vs smart components** | `OtpInput`, `WizardStepper`, `LoginErrorAlert` = dumb. `RegisterForm`, `LoginForm` = smart (hooks + store) |
| **3.2 < 150 lines per component** | Honored across new login files; legacy forms are within range |
| **4 State strategy** | Server state via TanStack Query; form state via RHF; multi-page client state via Zustand (only when needed) |
| **5 API layer** | Zero `fetch()` in components; all calls flow through `authService` |
| **6 Performance** | Form values use uncontrolled inputs (RHF `register`); only `OtpInput` and `Show/Hide` use local `useState` |
| **7.1 No long inline class strings** | `styles.ts` extracts the recurring tokens |
| **8 Forms & validation** | RHF + `@hookform/resolvers/zod`, Zod schemas in `packages/schemas` |
| **9 Error handling** | TanStack `onError` callbacks toast via `sonner`; field errors come from RHF + Zod |
| **10 Centralized formatting** | `lib/utils/mask.ts` for masking; date/INR helpers elsewhere |
| **11 Naming** | Files = kebab-case, components = PascalCase, hooks = `use*`, types = PascalCase |
| **12 Reusability** | `OtpInput`, `useResendTimer`, `AuthBrandPanel`, `AuthCard` all reused across register + login |
| **14 Cross-platform** | Schemas in `packages/schemas` are shared; UI components are web-only |
| **15 Security** | `httpOnly` cookies via Auth.js JWT strategy; identifier validated server-side; password never stored client-side beyond RHF state |

---

## 11. Known stubs / TODOs / hand-off notes

> **Read this before shipping anything auth-related.**

1. **Auth.js `authorize()` returns `null` (`lib/auth.ts`).** Every sign-in currently fails. To enable real sign-in: replace the stubbed body with a call to your backend (e.g. `apiClient.post("/auth/login", parsed.data)`) and return the user object. Until then, the UI will exercise the wrong-password → lockout flow on every attempt.

2. **`useLogin` collapses all non-ok results into `"wrong_password"`.** Once the backend distinguishes `locked` and `deactivated` responses, branch on `res.error` in `use-login.ts` and call `setLocked()` / `setDeactivated()` accordingly.

3. **`AccountDeactivatedView` is wired but never auto-triggered.** Plumb it through the moment the backend can return that signal — call `useLoginFlow.getState().setDeactivated({ companyName, identifier })` from wherever you detect it.

4. **`/login/forgot` is a static placeholder.** Build the real reset flow when ready (likely `/login/forgot` → email entry → email link → `/login/forgot/reset?token=…`).

5. **Verify OTP for register currently uses `account.email` as a placeholder `userId`** (`verify-otp-form.tsx`, line 51). Swap to the real `userId` once the register API returns it on success.

6. **`LoginMethodTabs` cross-route pill animation.** The `layoutId` is in place, but because Next.js fully unmounts the tabs component on route change, the slide doesn't currently play between `/login` and `/login/otp`. If smoother transitions matter, lift the tabs to a shared route layout or use parallel routes.

7. **`styles.ts` is opt-in for now.** The three register-era forms (`register-form.tsx`, `company-info-form.tsx`, `verify-otp-form.tsx`) still inline their tokens. Refactoring them to import from `styles.ts` is a safe cleanup when they're next touched.

8. **`maskEmail` is naive.** Doesn't handle multi-segment TLDs cleanly (e.g. `.co.uk`). Fine for the current demo data but tighten before broad use.

9. **`/login/otp/verify` does not show an inline "wrong code" alert.** Today it relies on toast + box-clear. Pattern after `VerifyOtpForm`'s inline `Wrong code` panel if you want parity.

10. **Backend endpoints assumed:** `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/resend-otp`, `POST /auth/login/otp/request`, `POST /auth/login/otp/verify`. The first three exist per spec; the OTP-sign-in pair is new and may need backend implementation.

---

**Document owner:** Frontend team
**Source of truth for code:** Always trust the files themselves over this document. If you spot a drift, update both.
