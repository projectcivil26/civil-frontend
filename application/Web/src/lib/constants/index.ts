import type { ProjectStatus, TaskStatus, UserRole } from "@sitestack/types";

// ── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROJECTS: "/dashboard/projects",
  LABOUR: "/dashboard/labour",
  EQUIPMENT: "/dashboard/equipment",
  FINANCE: "/dashboard/finance",
  REPORTS: "/dashboard/reports",
  SETTINGS: "/dashboard/settings",
} as const;

// ── Labels ───────────────────────────────────────────────────────────────────
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  project_manager: "Project Manager",
  site_supervisor: "Site Supervisor",
  finance: "Finance",
  procurement: "Procurement",
  viewer: "Viewer",
};

// ── Status badge color map (maps to Tailwind classes) ────────────────────────
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  on_hold: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

// ── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
