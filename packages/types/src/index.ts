// Shared TypeScript entity types — used by Web, Mobile, and Backend
// Add your domain types here as you build each feature

export type UserRole =
  | "admin"
  | "project_manager"
  | "site_supervisor"
  | "finance"
  | "procurement"
  | "viewer";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type TaskStatus = "not_started" | "in_progress" | "completed" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  managerId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
