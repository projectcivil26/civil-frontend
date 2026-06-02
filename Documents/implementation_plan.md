# SiteStack MVP Phase 1 Frontend Architecture & Planning

## Goal Description
Based on the SiteStack MVP Phase 1 BRD, this document outlines the frontend architecture, end-to-end flows, required services, dependencies, and a monorepo folder structure for both the Web (Next.js) and Mobile (React Native) applications. It also proposes an extended color palette that builds upon the brand's navy and gold to provide a catchy, modern aesthetic.

> [!IMPORTANT]
> **User Review Required**
> I have updated the plan below to address your questions regarding the technology choices. I also added details about handling **offline entries** in the mobile app. Please review the "Technology Explanations & Justifications" section and the updated Mobile Architecture section. Let me know if everything looks good to proceed!

---

## Technology Explanations & Justifications

To answer your specific questions on the technology stack:

1. **Expo vs Native CLI for Mobile**:
   **Expo** is significantly more efficient for development. Modern Expo (with "Expo Prebuild") gives you the best of both worlds: you get the ease of a managed workflow, rapid development, and Over-The-Air (OTA) updates, but you can still write custom native code if needed. React Native CLI requires managing complex native iOS/Android environments manually. Expo is the recommended industry standard for new React Native apps.
2. **Turborepo / Nx**:
   These are **Monorepo Build Systems**. They allow you to keep multiple apps (Web App + Mobile App) and shared libraries (like your Zod validation schemas or UI components) in a single GitHub repository. They are used to make development blazing fast by caching build and linting tasks so you only rebuild what you changed.
3. **Zustand**:
   It is a small, fast, and simple state-management library for React. Think of it as a modern, lightweight alternative to Redux. It is used to store global variables (like theme, sidebar open/close state) without the massive boilerplate Redux requires.
4. **TanStack Query (React Query)**:
   This is a powerful **data-fetching and caching library**. Instead of writing complex `useEffect` and `useState` hooks to fetch data from APIs, TanStack Query handles caching, background updates, loading/error states, and "optimistic updates" automatically. It makes your app feel instantly fast.
5. **expo-secure-store vs AsyncStorage**:
   **expo-secure-store is the efficient and necessary choice for Authentication.** AsyncStorage saves data in plain text, meaning tokens can be compromised. `expo-secure-store` encrypts the data and stores it in the device's native secure hardware (Keychain on iOS, Keystore on Android).
6. **Zod**:
   Zod is a schema validation library. It is used to ensure data is correct. For example, when a user fills the "Add Worker" form, Zod checks if the email is valid, the phone number is 10 digits, and all required fields are filled *before* sending it to the server. We write the rules once, and it prevents bad data from causing errors.
7. **PostCSS**:
   A tool for transforming CSS with JavaScript plugins. In our case, **Tailwind CSS requires PostCSS** to process the utility classes we write and generate the final optimized CSS file that the browser reads.
8. **Radix UI**:
   A library of unstyled, accessible UI components. Building complex interactive components like Dialogs, Dropdowns, and Tooltips from scratch that work correctly with keyboard navigation and screen readers is very hard. Radix gives us the invisible logic, and we use Tailwind to style it to look like SiteStack.
9. **clsx & tailwind-merge**:
   These two utilities are used together to manage CSS classes cleanly. `clsx` allows us to conditionally apply classes (e.g. `isActive ? 'bg-blue-500' : 'bg-gray-500'`). `tailwind-merge` intelligently overrides Tailwind classes (if a component has a default `p-4` padding but we pass `p-8`, it safely removes `p-4` and applies `p-8` without CSS conflicts).

---

## Monorepo Folder Structure
Using **Turborepo** to manage the Next.js and React Native codebases together.

```text
sitestack-monorepo/
├── apps/
│   ├── web/                # Next.js 14 (App Router) Application
│   └── mobile/             # React Native (Expo) Application
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── core-api/           # Shared API clients
│   ├── types/              # Shared TypeScript definitions (Models, Enums)
│   ├── config/             # Shared ESLint, Prettier, TS configurations
│   └── validation/         # Shared Zod schemas (Auth, Labour, etc.)
├── package.json
└── turbo.json
```

## Frontend Architecture

### 1. Web Application (Next.js)
- **Framework**: Next.js 14 (App Router) for Server-Side Rendering (SSR) and seamless API proxies.
- **Styling**: Tailwind CSS v4 paired with Radix UI headless primitives for accessible, customizable components.
- **State Management**: React Query (TanStack Query) for API data, React Hook Form + Zod for forms, Zustand for local UI state.
- **Authentication**: JWT access and refresh tokens stored in `httpOnly`, Secure cookies to prevent XSS. Next.js Middleware protects routes.

### 2. Mobile Application (React Native)
- **Framework**: React Native with **Expo (100% TypeScript)**.
- **Offline Database (Like WhatsApp)**: Since "Room Database" is specific to native Android, we will use **WatermelonDB** or **Expo SQLite with Drizzle ORM**. These are highly optimized local SQLite databases for React Native that will allow users to make offline entries (e.g. attendance, adding workers) when there is no internet, and automatically sync with the server when the connection is restored.
- **Styling**: Tailwind CSS via `NativeWind`.
- **State & Data**: React Query for data fetching when online, synchronized with the local SQLite database.
- **Navigation**: React Navigation v6 (Bottom Tabs + Stack Navigators).
- **Authentication**: Tokens stored securely using **expo-secure-store**.

## End-to-End Flow

### 1. Authentication Flow
- **Login Screen**: User selects Email/Password or Phone/OTP tabs.
- **Validation**: Frontend validates inputs (Zod).
- **Submission**: API call to `/auth/login` or `/auth/otp/send`.
- **Session Setup**: On success, tokens are stored (Web: `httpOnly` cookie, Mobile: `expo-secure-store`).

### 2. Labour Management Flow
- **Dashboard Navigation**: User lands on the AppShell and clicks "Labour Registry".
- **Registry View**: Fetches `/labour` API. Renders a filterable, sortable data table.
- **Registration**: Admin clicks "Add Worker", opening `RegisterWorkerDialog`. Form validated via Zod schemas, submitted to POST `/labour`. (Mobile: Saves to local SQLite database if offline, syncs later).

### 3. User Profile Flow
- **Access**: User clicks Avatar in the Sidebar footer.
- **View/Edit**: User edits profile details. Submitted via PUT `/users/profile`. Profile state is updated across the app.

## Suggested Color Palette

Incorporating the BRD's brand Navy and Gold while introducing modern, catchy accents for a premium SaaS feel:

| Role | Color Name | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | Brand Navy | `#1C3A5E` | Primary buttons, active nav items, AppShell Sidebar |
| **Brand Accent** | Brand Gold | `#C9974A` | Premium accents, active states, focus rings |
| **Background** | Mac Neutral | `#F5F5F7` | Overall page backgrounds |
| **Surface** | White | `#FFFFFF` | Cards, sidebars, dialogs |
| **Text Primary** | Slate 900 | `#0F172A` | Headings, primary text |
| **Text Secondary**| Slate 500 | `#64748B` | Labels, help text, placeholders |
| **Success/Active**| Emerald 500| `#10B981` | Status badges (Active), success toasts |
| **Warning/Pending**| Amber 500 | `#F59E0B` | Pending approvals, warnings |
| **Danger/Error** | Rose 500 | `#F43F5E` | Invalid fields, errors, Inactive badges |
