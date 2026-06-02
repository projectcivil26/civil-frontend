# SiteStack ERP — Dependency Documentation

**Project:** Civil Construction ERP SaaS  
**Platform:** Web (Next.js + TypeScript)  
**Date:** May 2026  
**Package Manager:** pnpm v11.1.2 with Turborepo monorepo  

---

## Table of Contents

1. [Framework & Core](#1-framework--core)
2. [Styling System](#2-styling-system)
3. [UI Components — shadcn/ui](#3-ui-components--shadcnui)
4. [Authentication](#4-authentication)
5. [Data Fetching & API Client](#5-data-fetching--api-client)
6. [Forms & Validation](#6-forms--validation)
7. [Data Tables & Virtualization](#7-data-tables--virtualization)
8. [Charts & Data Visualization](#8-charts--data-visualization)
9. [Date Handling & Calendar](#9-date-handling--calendar)
10. [State Management](#10-state-management)
11. [UI Utilities & Notifications](#11-ui-utilities--notifications)
12. [Developer Tools & Testing](#12-developer-tools--testing)
13. [Monorepo & Shared Packages](#13-monorepo--shared-packages)
14. [Dependency Map](#14-dependency-map)

---

## 1. Framework & Core

### `next` — v15.3.2

**What it is:** Next.js is a React framework that adds server-side rendering (SSR), static generation, file-based routing, API routes, image optimization, and font optimization on top of React.

**Why Next.js over alternatives:**

| Alternative | Problem |
|---|---|
| **Vite + React (SPA)** | Pure client-side app — no SSR, no built-in routing, no API routes. Auth-protected ERP dashboards need server rendering to avoid content flash and to gate routes at the server level, not just the client |
| **Create React App (CRA)** | Officially deprecated by Meta. No SSR, outdated webpack config, no longer maintained |
| **Remix** | Strong SSR framework but smaller ecosystem, less community tooling, and fewer production case studies for large-scale ERP apps |
| **Gatsby** | Optimized for static sites and content blogs — overkill config for a dynamic data-heavy ERP |

**Key benefits for this project:**
- **App Router** — nested layouts, loading/error boundaries per route, server components reduce JS bundle size
- **Server Actions** — call backend logic directly from forms without writing separate API endpoints
- **Middleware** — protect entire route groups (`/dashboard/**`) at the edge before the page renders
- **`next/image`** — automatic image optimization for project photos, site images, document attachments
- **`next/font`** — zero-layout-shift font loading

---

### `react` + `react-dom` — v19.1.0

**What it is:** The React library and its DOM renderer. Required peer dependency of Next.js.

**Why React 19:**
- React 19 introduces the **React Compiler** (experimental) which auto-memoizes components, eliminating the need for manual `useMemo`/`useCallback` in most cases
- New **`use()` hook** for reading promises and context inside render — cleaner async data patterns
- **Server Actions** are stable in React 19
- React 19 is the version Next.js 15 is designed around — using an older version causes peer dependency warnings and mismatches

---

### `typescript` — v5.8.3

**What it is:** A typed superset of JavaScript that compiles to plain JS.

**Why TypeScript over plain JavaScript:**
- Catches type errors at **build time**, not at 2AM when a site supervisor can't log their timesheet because `project.id` was passed as a number instead of a string
- **IntelliSense** across the entire codebase — every entity (Project, Invoice, Material) is fully typed, so your IDE autocompletes fields and warns on misuse
- Zod schemas (used in this project) generate TypeScript types automatically — one source of truth for both validation and typing
- Refactoring is safe — rename a field in `@sitestack/types` and every usage across Web, Mobile, and Backend that breaks gets flagged immediately

---

## 2. Styling System

### `tailwindcss` — v4.1.7

**What it is:** A utility-first CSS framework where you style elements by composing small utility classes directly in your markup (`className="flex items-center gap-4 p-6 bg-white rounded-lg"`).

**Why Tailwind over alternatives:**

| Alternative | Problem |
|---|---|
| **Material UI (MUI)** | Pre-styled components that look "Google-ish" by default. Customizing them for a branded ERP requires deep theme overrides using `sx` props or `createTheme()` — complex, verbose, and prone to breaking on upgrades |
| **Ant Design** | Excellent for internal tools but carries a very recognizable "Alibaba" aesthetic. Overriding it for a custom brand is painful. Large bundle size (~1.5MB unparsed) |
| **Chakra UI** | Good DX but slower render performance because it uses runtime CSS-in-JS. Tailwind generates static CSS at build time — zero runtime cost |
| **Bootstrap** | Predefined component classes — you fight specificity constantly. Hard to achieve unique designs |
| **Styled Components / Emotion** | Runtime CSS-in-JS — adds JS execution cost on every render. Tailwind's approach is compile-time only |
| **Plain CSS/SCSS Modules** | Requires naming every class, maintaining separate files, and mentally mapping names to styles. Tailwind keeps styles co-located with markup |

**Why Tailwind v4 specifically over v3:**
- **Rust-powered engine (Oxide)** — 5x faster build times
- **Zero configuration** — no `tailwind.config.ts` required for basic usage
- **CSS-first config** — customizations done in CSS with `@theme` instead of a JS config file
- **CSS variables by default** — design tokens are native CSS variables, usable anywhere (JS, inline styles, animations)

---

### `@tailwindcss/postcss` — v4.1.7

**What it is:** The PostCSS plugin that processes Tailwind v4 directives during the build. Required for Tailwind v4 to work with Next.js's build pipeline.

---

### `postcss` — v8.5.3

**What it is:** CSS transformation tool used by Next.js. Runs the Tailwind PostCSS plugin during the build.

---

### `radix-ui` — v1.4.3

**What it is:** A collection of unstyled, accessible UI primitives (Dialog, DropdownMenu, Popover, Select, Tooltip, etc.) that power all shadcn/ui components. Auto-installed by shadcn.

**Why Radix over alternatives:**

| Alternative | Problem |
|---|---|
| **Headless UI (by Tailwind Labs)** | Fewer components, limited to Tailwind ecosystem, less actively maintained |
| **Reach UI** | Largely unmaintained since 2022 |
| **Ariakit** | Good but smaller community and fewer ready-to-use patterns |
| **Rolling your own** | Accessible dropdowns, dialogs, and popovers are notoriously hard to get right (focus trapping, keyboard navigation, ARIA roles). Radix handles all of this |

**Key Radix benefits:**
- Full WAI-ARIA compliance — keyboard navigation, screen reader support, focus management all handled
- Unstyled by design — shadcn layers styles on top, giving you complete visual control
- Battle-tested in production at Vercel, Linear, and hundreds of other apps

---

## 3. UI Components — shadcn/ui

**What it is:** shadcn/ui is not an npm package — it is a collection of re-usable components built on top of Radix UI + Tailwind CSS. When you add a component, its source code is **copied into your project** at `src/components/ui/`. You own the code.

**Installed components (18 files in `src/components/ui/`):**

| Component | Primary use in this ERP |
|---|---|
| `button.tsx` | All CTAs — Submit, Cancel, Add Project, Approve Invoice |
| `input.tsx` | Text fields across all forms |
| `label.tsx` | Accessible form labels |
| `select.tsx` | Dropdowns — Project Status, Role, Category pickers |
| `textarea.tsx` | Notes, description fields, scope of work |
| `badge.tsx` | Status chips — Active, On Hold, Completed, Overdue |
| `card.tsx` | Dashboard summary cards, metric panels |
| `dialog.tsx` | Confirmation modals, quick-add forms |
| `sheet.tsx` | Slide-in panels for detail views without navigating away |
| `dropdown-menu.tsx` | Context menus — row actions in tables |
| `popover.tsx` | Floating panels — filters, column visibility toggles |
| `tooltip.tsx` | Help text on icon-only buttons |
| `table.tsx` | Base table structure (used with TanStack Table) |
| `form.tsx` | Form context + accessible error message binding (used with React Hook Form) |
| `avatar.tsx` | User profile pictures — project team members |
| `separator.tsx` | Visual dividers in sidebars and cards |
| `skeleton.tsx` | Loading placeholders — prevents layout shift while data loads |
| `scroll-area.tsx` | Custom scrollbars in sidebars, data panels |

**Why shadcn over traditional component libraries:**

| Alternative | Problem |
|---|---|
| **MUI** | You don't own the code. To change a button's border radius you fight the theme system. Component updates can break your customizations |
| **Ant Design** | Same ownership problem. Opinionated visual style that's hard to deviate from |
| **Mantine** | Good library but again you don't own the components. Heavy peer dependencies |
| **Chakra UI** | Runtime CSS-in-JS performance penalty, and same ownership problem |

**shadcn key advantages:**
- **You own the code** — edit any component file directly with no abstraction layer
- **No version lock-in** — components don't update unless you explicitly re-add them
- **Copy-on-demand** — only the components you actually use exist in your project
- **Tailwind-native** — no CSS-in-JS, no runtime style injection, pure static classes

---

## 4. Authentication

### `next-auth` — beta (Auth.js v5)

**What it is:** Auth.js v5 (the next generation of NextAuth.js) is a full authentication solution for Next.js. It handles JWT sessions, credential validation, route protection via middleware, and OAuth providers.

**Why Auth.js v5 over alternatives:**

| Alternative | Problem |
|---|---|
| **NextAuth v4** | Does not support Next.js App Router natively. Requires workarounds for server components and middleware. v4 is in maintenance mode |
| **Clerk** | SaaS product — you pay per monthly active user and your user data lives on their servers. Problematic for an ERP with sensitive construction project data |
| **Auth0** | Same SaaS concerns as Clerk. Fine for consumer apps, but ERP clients often have data residency requirements |
| **Supabase Auth** | Tied to the Supabase ecosystem. If your backend is custom (not Supabase), integration is awkward |
| **Rolling your own JWT** | You have to implement: token generation, refresh token rotation, CSRF protection, session revocation, secure cookie handling. Auth.js does all of this correctly |

**Key benefits:**
- **App Router native** — designed for Next.js 15, uses the new `handlers` export pattern
- **CredentialsProvider** — validates against your own backend API login endpoint — no third-party dependency for user data
- **JWT strategy** — stateless, scales horizontally, no session database required
- **Middleware integration** — protect entire route groups (`/dashboard/**`) at the edge with one `auth()` call
- **Role callbacks** — extend JWT/session to carry `role` field, enabling role-based rendering throughout the UI

---

## 5. Data Fetching & API Client

### `@tanstack/react-query` — v5.77.0

**What it is:** A server state management library. It handles the full lifecycle of async data: fetching, caching, background refetching, loading states, error states, and cache invalidation.

**Why React Query over alternatives:**

| Alternative | Problem |
|---|---|
| **Redux Toolkit Query (RTK Query)** | Requires setting up Redux store, slices, and reducers even for simple data fetching. Significant boilerplate. Overkill when you only need server state, not complex client state |
| **SWR (by Vercel)** | Simpler API but fewer features — no mutation support, no query invalidation, no dependent queries, no infinite scroll. React Query v5 covers all ERP data patterns |
| **useEffect + fetch** | Manual: you write loading state, error state, caching, and refetch logic yourself for every single API call. In an ERP with 30+ screens each hitting multiple endpoints, this becomes unmanageable |
| **Apollo Client** | Only relevant if your backend uses GraphQL. For a REST backend, it is heavy and unnecessary |

**Key benefits for ERP:**
- **Automatic caching** — project list fetched on the Projects screen is reused on the Dashboard without a second API call
- **Background refetch** — stale data automatically refreshes when the user returns to a tab, so a site supervisor always sees the latest timesheet entries
- **Optimistic updates** — mark a task complete and the UI updates instantly before the API responds
- **Query invalidation** — after creating a new project, the projects list cache is invalidated and refreshed automatically
- **DevTools** — visual overlay in dev mode showing every query's state, data, and staleness

---

### `axios` — v1.9.0

**What it is:** A promise-based HTTP client for making API requests.

**Why Axios over alternatives:**

| Alternative | Problem |
|---|---|
| **Native `fetch`** | No built-in interceptors. To attach a JWT token to every request you must wrap fetch in a custom function everywhere, or maintain a centralized wrapper — which is essentially reinventing Axios |
| **`ky`** | Good but smaller community. Less documentation and fewer Stack Overflow answers when you hit edge cases |
| **`superagent`** | Older library, less maintained, older API design |

**Key benefits:**
- **Request interceptors** — attach the `Authorization: Bearer <token>` header to every outgoing request in one place
- **Response interceptors** — catch every 401 response globally and redirect to the login page without writing that logic in every API call
- **Automatic JSON** — no need to call `.json()` on responses, data is automatically parsed
- **Request cancellation** — cancel in-flight requests when a component unmounts (prevents state updates on unmounted components)
- **Timeout config** — the `@sitestack/api-client` package sets a 15-second timeout globally

---

## 6. Forms & Validation

### `react-hook-form` — v7.75.0

**What it is:** A performance-first form library that uses uncontrolled inputs (native DOM refs) instead of controlled React state.

**Why React Hook Form over alternatives:**

| Alternative | Problem |
|---|---|
| **Formik** | Uses controlled inputs — every keystroke re-renders the entire form tree. A 40-field procurement form re-renders 40 times per second while the user types. Noticeable lag |
| **`useState` per field** | Manual: you manage every field's value, touched state, error state, and submission state yourself. For a 30-field project creation form, that's 90+ state variables |
| **Final Form** | Older, less maintained, more verbose API |

**Key benefits for ERP:**
- **Zero re-renders on type** — uncontrolled inputs mean the form component only re-renders on submit or validation, not on every keystroke
- **Nested field arrays** — `useFieldArray` handles dynamic rows (add/remove work items, team members, line items in an invoice) without any extra state
- **Validation modes** — validate `onBlur`, `onChange`, or `onSubmit` depending on field sensitivity
- **Easy integration with Zod** — via `@hookform/resolvers`, the Zod schema drives all validation logic

---

### `zod` — v3.25.76

**What it is:** A TypeScript-first schema declaration and validation library. You define a schema once and get both runtime validation AND TypeScript type inference from it.

**Why Zod over alternatives:**

| Alternative | Problem |
|---|---|
| **Yup** | No TypeScript-first design. Types are inferred but less precise. Async validation API is more verbose |
| **Joi** | Built for Node.js server validation, not TypeScript frontends. Poor TypeScript support |
| **`class-validator`** | Decorator-based, requires `experimentalDecorators` TypeScript flag, and doesn't integrate as cleanly with React Hook Form |
| **Manual validation** | Write your own error messages, nesting logic, and async checks from scratch for every form |

**Key benefits:**
- **Single source of truth** — `const projectSchema = z.object({...})` → `type ProjectInput = z.infer<typeof projectSchema>` — one schema gives you both the validator AND the TypeScript type
- **Shared schemas** — the `@sitestack/schemas` package shares these schemas between Web and Mobile, so validation rules are never duplicated
- **Composable** — schemas can extend, merge, and transform each other (e.g., `projectSchema.extend({ id: z.string() })` for update vs create)
- **Error messages** — human-readable, per-field error messages built in (`z.string().min(1, "Project name is required")`)

---

### `@hookform/resolvers` — v5.2.2

**What it is:** A small adapter package that connects Zod schemas (and other validators) into React Hook Form's validation engine.

**Why needed:** React Hook Form has its own validation API. This package acts as the bridge so you can pass a Zod schema directly into `useForm({ resolver: zodResolver(mySchema) })` instead of writing custom validation functions.

---

## 7. Data Tables & Virtualization

### `@tanstack/react-table` — v8.21.3

**What it is:** A headless, framework-agnostic table engine. It provides all the logic for sorting, filtering, pagination, column visibility, row selection, grouping, and column pinning — but renders nothing. You provide the HTML and styles.

**Why TanStack Table over alternatives:**

| Alternative | Problem |
|---|---|
| **AG Grid (Community)** | Free community version lacks row grouping, advanced filtering, and Excel export. Enterprise features cost $1,500+/dev/year. Also ships its own CSS that clashes with Tailwind |
| **React Table v7** | The predecessor to TanStack Table v8. Uses a different hooks API, no longer maintained, no TypeScript-first design |
| **MUI DataGrid** | Tied to Material UI's design system. Community version lacks virtualization and advanced features. Pro version is $180/dev/year |
| **`<table>` with `useState`** | Manual: implement sort, filter, pagination, column resize from scratch for every table. An ERP has 15+ tables |
| **Tanstack Table v7 (react-table)** | Outdated API, not TypeScript-first, being replaced by v8 |

**Key benefits for ERP:**
- **Headless** — full control over markup and styling, consistent with the Tailwind + shadcn design system
- **Column pinning** — freeze the Project Name column while scrolling right through financial columns
- **Row selection** — select multiple invoices for bulk approval
- **Server-side operations** — sorting/filtering/pagination can be delegated to the backend API for large datasets
- **Strongly typed** — `createColumnHelper<Project>()` gives full TypeScript autocomplete on column definitions

---

### `@tanstack/react-virtual` — v3.13.6

**What it is:** A virtualization library that renders only the visible rows in a large list or table, keeping the DOM small regardless of dataset size.

**Why needed for ERP:**
- A construction project with 5 years of daily timesheets has ~1,800 rows. Rendering all of them as DOM nodes freezes the browser
- With virtualization, only ~20 rows are in the DOM at any time. Scrolling through 10,000 rows feels instant
- Works alongside TanStack Table — TanStack Table handles logic, TanStack Virtual handles DOM efficiency

**Why over alternatives:**

| Alternative | Problem |
|---|---|
| **`react-window`** | Older library, less maintained, requires fixed row heights (problematic for variable-height ERP rows) |
| **`react-virtualized`** | The predecessor to react-window. Large bundle, outdated API |
| **Pagination only** | Pagination is a UX compromise — power users in ERP prefer scrollable tables. Virtualization gives you infinite scroll performance with no UX tradeoff |

---

## 8. Charts & Data Visualization

### `recharts` — v2.15.3

**What it is:** A composable charting library built on D3 and React SVG. Provides Bar, Line, Area, Pie, Composed, Scatter, Radar, and Treemap charts as React components.

**Why Recharts over alternatives:**

| Alternative | Problem |
|---|---|
| **Chart.js + `react-chartjs-2`** | Canvas-based, not React-native. Requires `ref` manipulation for updates, awkward integration with React's render cycle, harder to customize individual elements |
| **Victory** | Good library but 3x larger bundle than Recharts, less maintained, fewer chart types |
| **D3.js (direct)** | Extremely powerful but steep learning curve. D3 manages the DOM imperatively which conflicts with React's declarative model. Appropriate only when you need custom chart types not available in any library |
| **Nivo** | Beautiful charts but very large bundle. Server-side rendering support is inconsistent |
| **Visx (by Airbnb)** | Low-level D3-React bindings — powerful but requires significant setup for each chart type. Better suited when you need full custom charts, not standard ERP visualizations |

**Key benefits:**
- **React-native** — charts are React components with props, no ref manipulation
- **Composable** — `<ComposedChart>` lets you layer bar + line + area on the same axes (budget vs actual vs projected)
- **Responsive** — `<ResponsiveContainer>` auto-sizes charts to their parent container
- **Customizable tooltips** — render any JSX as a tooltip (project details, crew info, cost breakdown)
- **React 19 compatible** — actively maintained and tested with modern React

---

## 9. Date Handling & Calendar

### `date-fns` — v4.1.0

**What it is:** A modern JavaScript date utility library. Provides 200+ functions for parsing, formatting, manipulating, and comparing dates — all pure functions, all tree-shakeable.

**Why date-fns over alternatives:**

| Alternative | Problem |
|---|---|
| **Moment.js** | **Deprecated** since 2020. 67KB minified (the entire library loads even if you use one function). Mutable date objects cause subtle bugs |
| **Day.js** | Good lightweight alternative but weaker TypeScript support. Plugins architecture means you must import and extend manually for each feature (duration, relative time, etc.) |
| **Luxon** | Good TypeScript support but 23KB minimum. Less community usage than date-fns |
| **Native `Date`** | JavaScript's `Date` API is notoriously inconsistent — different behavior across browsers, timezone handling is error-prone, no formatting utilities |

**Key benefits:**
- **Tree-shakeable** — `import { format } from 'date-fns'` imports only the 2KB `format` function, not 200 others
- **Immutable** — all functions return new Date objects, never mutate
- **Consistent timezone handling** — date-fns-tz extension for construction sites across time zones
- **date-fns v4** — ESM-only, best bundle sizes yet

---

### `react-day-picker` — v9.7.0

**What it is:** An accessible, composable date picker React component built on date-fns. Supports single date, date range, and multi-select modes.

**Why react-day-picker over alternatives:**

| Alternative | Problem |
|---|---|
| **`react-datepicker`** | Older, jQuery-era design patterns. Heavy CSS, harder to style with Tailwind. Accessibility is an afterthought |
| **MUI DatePicker** | Tied to the Material UI design system. Using it without MUI requires fighting the theme system |
| **Flatpickr** | Vanilla JS library wrapped in React. Not a true React component — uses DOM manipulation internally |
| **Rolling your own** | Building an accessible calendar with keyboard navigation (arrow keys, Page Up/Down for month navigation), ARIA labels, and range selection from scratch takes weeks |

**Key benefits:**
- **Fully accessible** — WCAG 2.1 compliant, full keyboard navigation
- **date-fns v4 native** — no adapter needed, same date library used throughout the project
- **Composable** — controlled component, works seamlessly with React Hook Form
- **Tailwind-styleable** — accepts `classNames` props for every element, no CSS conflicts

---

## 10. State Management

### `zustand` — v5.0.5

**What it is:** A minimal, fast global state management library. A store is a custom hook that holds state and actions.

**Why Zustand over alternatives:**

| Alternative | Problem |
|---|---|
| **Redux Toolkit** | Requires: configureStore, createSlice, action creators, reducers, selectors, and Provider wrapping. ~50 lines of boilerplate for a simple "is the sidebar open?" flag. RTK is excellent for large teams with complex shared state, but overkill here |
| **Context API** | Re-renders every consumer when any part of context changes. A sidebar toggle would re-render every component that reads user role. Zustand uses fine-grained subscriptions — only components that read the changed slice re-render |
| **Jotai** | Atomic model — good for derived state but more complex mental model for ERP-style "load user, store role, check permissions" patterns |
| **Recoil** | Facebook's library, experimental APIs, uncertain long-term maintenance |
| **MobX** | Requires decorators or observable wrappers around data. More powerful than needed for this use case |

**Why Zustand for this ERP specifically:**
- Client-side state is small: active project, sidebar state, user role, UI preferences
- Server state is handled by React Query — Zustand only handles what React Query doesn't (pure UI state)
- The `immer` middleware (see below) makes state updates readable
- Zero boilerplate — a complete store is 10 lines

---

### `immer` — v10.1.1

**What it is:** A library that lets you write "mutating" state update code that is actually immutable under the hood, using JavaScript Proxies.

**Why needed with Zustand:**
Without immer:
```ts
set((state) => ({ user: { ...state.user, role: newRole } }))
```
With immer:
```ts
set((state) => { state.user.role = newRole })
```

For deeply nested ERP state (project → phase → task → assignees), immer eliminates the pyramid of spread operators. The code reads like direct mutation but remains immutable.

---

## 11. UI Utilities & Notifications

### `clsx` — v2.1.1

**What it is:** A tiny utility for conditionally joining CSS class names.

```ts
clsx("base-class", isActive && "active", hasError && "error")
// → "base-class active" or "base-class error" etc.
```

**Why:** Conditional class building without string concatenation bugs. Used in every component that has conditional styles.

---

### `tailwind-merge` — v3.3.0

**What it is:** Intelligently merges Tailwind CSS classes, resolving conflicts correctly.

```ts
twMerge("px-2 py-1 p-4")  // → "p-4"  (not "px-2 py-1 p-4" which would conflict)
twMerge("text-red-500 text-blue-500")  // → "text-blue-500"
```

**Why needed:** When you pass `className` props to components and override base styles, naive string concatenation breaks Tailwind — both conflicting classes would be in the DOM and the cascade determines the winner (often not what you want). `tailwind-merge` resolves conflicts by keeping only the last value for each CSS property group.

The `cn()` utility in `src/lib/utils.ts` combines `clsx` and `tailwind-merge`:
```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `class-variance-authority` — v0.7.1

**What it is:** A utility for creating component variants with TypeScript safety.

```ts
const buttonVariants = cva("base-styles", {
  variants: {
    size: { sm: "text-sm px-2", md: "text-base px-4", lg: "text-lg px-6" },
    intent: { primary: "bg-blue-600", danger: "bg-red-600" }
  }
})
```

**Why:** Used internally by all shadcn components to define type-safe variant systems. When you add new ERP-specific variants (e.g., a `warning` badge for budget overruns), CVA ensures the variant props are fully typed.

---

### `sonner` — v2.0.5

**What it is:** A toast notification library. Renders dismissible notification popups in a stack.

**Why Sonner over alternatives:**

| Alternative | Problem |
|---|---|
| **`react-hot-toast`** | Less customizable, no rich content support, smaller API surface |
| **`react-toastify`** | Ships heavy CSS, harder to style with Tailwind, larger bundle |
| **Native `alert()`** | Blocks the browser thread, no customization, terrible UX |
| **Custom implementation** | Handling toast stacking, auto-dismiss timers, pause-on-hover, and animations is non-trivial |

**Key benefits:**
- Single `<Toaster>` in the root layout — call `toast.success("Project saved")` from anywhere in the app
- `richColors` prop — green for success, red for error, orange for warning — maps perfectly to ERP status feedback
- Promise toast — `toast.promise(saveProject(), { loading: "Saving...", success: "Saved!", error: "Failed" })` for async operations

---

### `lucide-react` — v0.511.0

**What it is:** A React icon library with 1,000+ consistent SVG icons.

**Why Lucide over alternatives:**

| Alternative | Problem |
|---|---|
| **Heroicons** | Only ~280 icons. Missing construction-specific icons (Hammer, HardHat, Truck, Warehouse) |
| **Font Awesome** | Icon font (not SVG), large bundle if using the full set, free tier has limited icons |
| **React Icons** | Aggregates multiple icon sets — inconsistent sizing and visual weight across icons |
| **SVG files manually** | Maintaining an icon library manually is tedious |

**Key benefits:**
- **Consistent design language** — all icons share the same stroke weight and visual style
- **Tailwind-compatible** — sized with `className="w-4 h-4"`, colored with `className="text-gray-500"`
- **The icon set shadcn is designed around** — all shadcn components use Lucide icons internally for consistency
- **Construction-relevant icons** — `Building2`, `HardHat`, `Truck`, `Warehouse`, `Hammer`, `FileText`, `Receipt`, `Users`

---

### `nuqs` — v2.4.3

**What it is:** URL search parameter state management for Next.js. Syncs React state to the URL query string.

```ts
const [status, setStatus] = useQueryState("status")
// URL: /projects?status=active&page=2&sort=budget
```

**Why nuqs over alternatives:**

| Alternative | Problem |
|---|---|
| **`useState` only** | Filter state is lost on page refresh. A project manager can't bookmark "show all active projects sorted by budget" |
| **`useSearchParams` manually** | Reading and writing URL params manually requires `useRouter`, `useSearchParams`, and careful serialization. Verbose and error-prone |
| **Redux/Zustand for filters** | Filter state doesn't survive a page share — send a URL to a colleague and they see a different view |

**Key benefits for ERP:**
- **Shareable filtered views** — project manager sends `/projects?status=active&phase=construction` to a colleague who sees the exact same filtered table
- **Bookmarkable dashboards** — browser back/forward works correctly for filtered states
- **Server component compatible** — works with Next.js App Router's server component model

---

## 12. Developer Tools & Testing

### `@tanstack/react-query-devtools` — v5.77.0 *(dev)*

**What it is:** A floating overlay in development mode showing every React Query query — its status (loading/success/error), cached data, staleness, and refetch times.

**Why essential:** Without this, debugging "why is this component showing stale data?" involves console.logging through the query cache. The DevTools make cache behavior transparent.

---

### `@testing-library/react` — v16.3.0 *(dev)*
### `@testing-library/jest-dom` — v6.6.3 *(dev)*

**What it is:** Testing utilities that render React components and provide queries to find elements the way a user would (`getByRole`, `getByText`, `getByLabelText`).

**Why Testing Library over Enzyme:**
Enzyme tests implementation details (component state, method calls). Testing Library tests behavior — what the user sees and does. This means tests don't break when you refactor internals, only when actual behavior changes.

---

### `jest` + `jest-environment-jsdom` + `ts-jest` — v29 *(dev)*

**What it is:** The test runner, browser environment simulator, and TypeScript preprocessor for tests.

---

### `prettier` — v3.5.3 *(dev)*
### `prettier-plugin-tailwindcss` — v0.6.11 *(dev)*

**What it is:** Code formatter that enforces consistent style. The Tailwind plugin auto-sorts class names into a consistent order.

**Why Prettier:** Eliminates all code style debates. Every developer's editor formats on save to the same output. The Tailwind plugin specifically sorts classes into the canonical order (`flex items-center gap-4` not `gap-4 flex items-center`) so diffs are clean.

---

### `eslint` + `eslint-config-next` — v9 / v15 *(dev)*

**What it is:** Static analysis tool that catches code quality issues, unused variables, React hooks violations, and accessibility problems before runtime.

---

### `ts-jest` — v29.3.4 *(dev)*

**What it is:** Jest transformer that lets Jest understand TypeScript files without a separate compile step.

---

## 13. Monorepo & Shared Packages

### `turbo` — latest (workspace root)

**What it is:** Turborepo is a high-performance build system for JavaScript/TypeScript monorepos. It understands the dependency graph between packages and runs tasks in parallel where possible, caching results to skip redundant work.

**Why Turborepo over alternatives:**

| Alternative | Problem |
|---|---|
| **Nx** | More powerful but significantly more complex configuration. Better suited for very large enterprise monorepos with 50+ packages |
| **Lerna** | Older tool, primarily for package publishing. Build orchestration is limited compared to Turborepo |
| **pnpm workspaces alone** | pnpm handles package installation and linking but has no task scheduling, parallelization, or caching |
| **No monorepo (separate repos)** | Sharing types between Web and Mobile requires publishing packages to npm or using git submodules — both add friction to development |

**Key benefits:**
- **Remote caching** — build artifacts are cached. `turbo run build` on the second run is near-instant if nothing changed
- **Parallel execution** — `turbo run lint` runs lint in Web, Mobile, and Backend simultaneously
- **Dependency-aware** — if `@sitestack/types` changes, Turborepo knows to rebuild Web and Mobile but not unrelated packages

---

### pnpm workspaces

**Why pnpm over npm/yarn for the monorepo:**

| Alternative | Problem |
|---|---|
| **npm workspaces** | Hoisting can cause phantom dependencies (a package works locally because it's hoisted from another workspace but will fail in isolation) |
| **Yarn workspaces** | Yarn Classic (v1) has known workspace bugs. Yarn Berry (v3/v4) has a different module resolution system (PnP) that breaks some packages |

**pnpm benefits:**
- **Strict isolation** — each package can only access what it explicitly declares as a dependency
- **Disk efficiency** — packages are stored once in a content-addressable store and hard-linked, saving gigabytes on large monorepos
- **Speed** — pnpm install is 2–3x faster than npm install on cold cache

---

### `@sitestack/types` *(shared package)*

Shared TypeScript entity interfaces: `User`, `Project`, `UserRole`, `ProjectStatus`, `ApiResponse<T>`, `PaginatedResponse<T>`. Used by Web, Mobile, and Backend — change a field once, get errors everywhere it's used incorrectly.

---

### `@sitestack/schemas` *(shared package)*

Shared Zod validation schemas: `loginSchema`, `projectSchema`. Web and Mobile validate against the same rules. Prevents "the mobile app accepts this input but the web app rejects it" inconsistencies.

---

### `@sitestack/utils` *(shared package)*

Shared utility functions: `formatDate()`, `formatCurrency()`, `projectDuration()`, `calculateProgress()`. One implementation, used by all platforms.

---

### `@sitestack/api-client` *(shared package)*

Shared Axios instance with JWT interceptors. Both Web (Axios in API calls) and Mobile (Axios in React Native) use the same base client with the same auth logic.

---

## 14. Dependency Map

```
@sitestack/web (Next.js app)
│
├── Framework
│   ├── next@15
│   ├── react@19
│   └── react-dom@19
│
├── Styling
│   ├── tailwindcss@4
│   ├── @tailwindcss/postcss@4
│   ├── radix-ui@1 (auto-installed by shadcn)
│   └── shadcn/ui components (18 files in src/components/ui/)
│
├── Auth
│   └── next-auth@beta (Auth.js v5)
│
├── Data Fetching
│   ├── @tanstack/react-query@5
│   └── axios@1
│
├── Forms
│   ├── react-hook-form@7
│   ├── zod@3
│   └── @hookform/resolvers@5
│
├── Tables
│   ├── @tanstack/react-table@8
│   └── @tanstack/react-virtual@3
│
├── Charts
│   └── recharts@2
│
├── Dates
│   ├── date-fns@4
│   └── react-day-picker@9
│
├── State
│   ├── zustand@5
│   └── immer@10
│
├── UI Utilities
│   ├── clsx@2
│   ├── tailwind-merge@3
│   ├── class-variance-authority@0.7
│   ├── sonner@2
│   ├── lucide-react@0.511
│   └── nuqs@2
│
├── Shared Workspace Packages
│   ├── @sitestack/types
│   ├── @sitestack/schemas
│   ├── @sitestack/utils
│   └── @sitestack/api-client
│
└── Dev Only
    ├── typescript@5
    ├── @types/node, @types/react, @types/react-dom
    ├── eslint@9 + eslint-config-next@15
    ├── prettier@3 + prettier-plugin-tailwindcss
    ├── jest@29 + jest-environment-jsdom + ts-jest
    ├── @testing-library/react + @testing-library/jest-dom
    └── @tanstack/react-query-devtools@5
```

---

*Document maintained by the SiteStack ERP development team.*  
*Last updated: May 2026*
