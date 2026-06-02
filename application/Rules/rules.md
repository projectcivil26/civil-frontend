# SiteStack Frontend Engineering Rules & Best Practices

This document outlines the core principles, architectural decisions, and best practices that must be followed throughout the SiteStack frontend codebase (Web and Mobile).

---

## 🧱 1. Core Principles (Non-Negotiables)

### 1.1 Server-First Mindset (Next.js 14 App Router)
- Default everything to **Server Components**.
- Use `"use client"` **only** when strictly needed for:
  - Interactivity (onClick, onChange)
  - Browser APIs (window, localStorage)
  - React Hooks (`useState`, `useEffect`, `useRef`)
> **👉 Rule:** If it can be rendered on the server, it MUST be rendered on the server.

### 1.2 Strict Separation of Concerns
- UI ≠ Business logic ≠ API layer
- **Never mix:**
  - API calls directly inside UI components.
  - Validation logic inside UI components.
  - Formatting logic scattered everywhere.

### 1.3 Type Safety Everywhere
- **No `any`** types allowed.
- Use **Zod** as the single source of truth for validation.
- Share schemas between the backend (FastAPI) and frontend wherever possible.

---

## 📁 2. Scalable Folder Structure (Feature-Driven)

Organize the codebase by **feature/domain**, not by file type.

```text
src/
├── app/                     # Next.js App Router (Pages & Layouts)
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # Pure reusable UI primitives (Radix + Tailwind)
│   ├── shared/             # Cross-feature components (e.g., Global Header)
├── features/               # Domain-based architecture (THE CORE)
│   ├── projects/
│   │   ├── components/     # Feature-specific components
│   │   ├── hooks/          # Feature-specific hooks
│   │   ├── services/       # API calls for this feature
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── schema.ts       # Zod schemas
├── lib/
│   ├── api/                # Base API client (Axios config, interceptors)
│   ├── utils/              # Generic helpers (clsx, formatters)
│   └── constants/          # Global constants
├── hooks/                  # Global hooks (e.g., useMediaQuery)
├── store/                  # Global state (Zustand, if needed)
├── styles/                 # Global CSS
└── types/                  # Global shared types
```

---

## 🧩 3. Component Design Rules

**Component Hierarchy:** `Page → Layout → Feature Component → UI Component`

### 3.1 Types of Components
1. **UI Components (Dumb):**
   - No business logic, no API calls, purely driven by props.
   - Example: `<Button variant="primary" />`
2. **Feature Components (Smart):**
   - Handle logic, call hooks and services, pass data down to UI components.
   - Example: `<ProjectList />`
3. **Layout Components:**
   - Structural only (wrappers, grids). No heavy logic.

### 3.2 Component Constraints
- Keep components **< 150 lines**. If it's longer, extract smaller components.
- One responsibility per component.
- Extract complex logic into custom hooks.

---

## 🧠 4. State Management Strategy

> **Golden Rule:** Prefer Server State over Client State.

| State Type | Tool to Use |
| :--- | :--- |
| **Server Data** | React Query / Fetch |
| **Form State** | React Hook Form |
| **Local UI State**| `useState` / `useReducer` |
| **Global State** | Zustand (Only if strictly needed) |

**Avoid Global State** unless dealing with:
- Authenticated user data
- Theme/Dark mode preferences
- Real-time/WebSocket data stores

---

## 🌐 5. API Layer Best Practices

**❌ NEVER fetch directly in a component like this:**
```tsx
// Bad
useEffect(() => { fetch("/api/projects") }, [])
```

**✔️ ALWAYS abstract API calls into services and hooks:**
```ts
// features/projects/services/project.service.ts
export const getProjects = async () => api.get("/projects")

// features/projects/hooks/useProjects.ts
export const useProjects = () => {
  return useQuery({ queryKey: ["projects"], queryFn: getProjects })
}
```

---

## ⏱️ 6. Performance Patterns

1. **Debounce Inputs:** Always debounce search API calls.
   ```ts
   const debouncedSearch = useDebounce(search, 500)
   ```
2. **Route-Based Modals:** Use URL query parameters instead of `useState` for modals.
   - *Why?* Shareable URLs, browser back button works naturally, no global state needed.
   - Example: `/projects?modal=create`
3. **Lazy Loading:** Dynamically import heavy components.
   ```ts
   const Chart = dynamic(() => import("./Chart"), { ssr: false })
   ```
4. **Memoization:** Use `useMemo` and `useCallback` **only** when profiling shows a need. Don't prematurely optimize.

---

## 🎨 7. Styling Rules (Tailwind + Radix)

1. **No Long Class Strings Inline:**
   Extract long strings to variables for readability.
   ```tsx
   // Good
   const containerStyles = "p-2 flex items-center justify-between bg-white rounded shadow"
   <div className={containerStyles}>
   ```
2. **Utility Composition:**
   Use `cva` (Class Variance Authority) for component variants, combined with `tailwind-merge`.
   ```ts
   const buttonVariants = cva("rounded px-4 font-medium", {
     variants: {
       variant: { primary: "bg-blue-600", secondary: "bg-gray-200" }
     }
   })
   ```
3. **Radix UI:** Always wrap Radix primitives with your design system (Tailwind). Never use raw Radix directly in feature components.

---

## 📋 8. Forms & Validation

> **Rule:** Validation logic lives in Zod, NOT in components.

- **Setup:** React Hook Form + `@hookform/resolvers/zod`.
- **Optimization:** Use controlled inputs only when absolutely necessary. Use `<FormProvider>` for deeply nested or large forms to avoid prop drilling. Split large forms into logical sections.

```ts
const schema = z.object({ name: z.string().min(1) })
const form = useForm({ resolver: zodResolver(schema) })
```

---

## 🔐 9. Error Handling & Fallbacks

1. **API Errors:** Use a centralized Axios interceptor/error handler. Display user-friendly toasts using `sonner`.
2. **UI Fallbacks:**
   - Always provide Loading Skeletons for async data.
   - Use React Error Boundaries for critical component failures.

---

## 📊 10. Data Formatting & Enums

**Always centralize formatting logic.**
- **Dates:** Use `date-fns` (e.g., `formatDate(date)`).
- **Currency:** Create a centralized `formatINR(amount)` utility.
- **Enums:** Store all status/role enums in `constants/` or `types/` and reference them globally. No hardcoded magic strings.

---

## 🧪 11. Code Quality & Formatting

- **Linting:** Strict ESLint and Prettier enforcement.
- **Types:** Strict TypeScript (`strict: true` in `tsconfig.json`).
- **Environment Variables:** Validate `process.env` at startup using Zod (e.g., T3 Env pattern) to ensure the app fails fast if a required API key is missing.

**Naming Conventions:**
| Type | Format | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase | `UserProfile.tsx` |
| **Hooks** | camelCase (prefix `use`) | `useProjects.ts` |
| **Files/Folders**| kebab-case | `project-list.tsx` |
| **Types/Interfaces**| PascalCase | `ProjectData` |

---

## 🔄 12. Reusability Strategy

- **Extract when:** A piece of UI or logic is reused 2+ times, or if the logic is too complex for the current file.
- **Avoid:** Over-abstraction and premature generalization. Duplication is cheaper than the wrong abstraction.

---

## 🚀 13. Advanced Patterns (High Impact)

1. **Optimistic UI:** Use TanStack Query's `onMutate` to instantly update the UI before the server responds.
2. **Infinite Scroll:** Prefer Intersection Observer API over pagination buttons for feeds/lists.
3. **Permission-Based UI:** Handle access control cleanly.
   ```ts
   if (!user.canEdit) return null;
   ```
4. **Feature Flags:** Wrap new features in flags for safe rollouts.

---

## 📱 14. Cross-Platform Strategy (Web + React Native)

In the Turborepo monorepo:
- **DO SHARE:** Types, Validation Schemas (Zod), API Client logic, Constants, Utility functions.
- **DO NOT SHARE:** UI Components or Styling (React Native uses `View`/`Text`, Web uses `div`/`span`). Keep presentation layers entirely separate.

---

## 🛡️ 15. Security & Accessibility (Added Best Practices)

1. **Accessibility (a11y):** Ensure interactive elements are keyboard navigable. Use proper `aria-` attributes. Rely on Radix UI to handle the heavy lifting for accessibility.
2. **Security:** Never use `dangerouslySetInnerHTML` unless strictly sanitizing with a library like DOMPurify. Handle auth tokens strictly via `httpOnly` cookies (Web) or `expo-secure-store` (Mobile).

---

## ⚠️ 16. Common Mistakes to Avoid

- ❌ Fetching directly inside components.
- ❌ Overusing global state (Zustand/Redux) for server data.
- ❌ Mixing UI layout with complex business logic.
- ❌ Forgetting loading states and error boundaries.
- ❌ Creating monolithic, huge components (>150 lines).
- ❌ Dumping files without adhering to the feature-folder structure.
- ❌ Hardcoding strings, URLs, or API endpoints.

---

## 🧭 Final Mental Model

Visualize the flow of data and responsibility like this:

```text
UI Components (Dumb, pure presentation)
      ↓
Feature Components (Logic, Hooks)
      ↓
Services Layer (Axios API calls)
      ↓
Backend API (FastAPI)
```
