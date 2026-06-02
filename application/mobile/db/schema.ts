import { int, text, real, sqliteTable } from "drizzle-orm/sqlite-core";

// Offline-first tables — synced to backend when internet is restored

export const offlineAttendance = sqliteTable("offline_attendance", {
  id: text("id").primaryKey(),
  workerId: text("worker_id").notNull(),
  projectId: text("project_id").notNull(),
  date: text("date").notNull(),
  status: text("status", { enum: ["present", "absent", "half_day"] }).notNull(),
  synced: int("synced", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const offlineEntries = sqliteTable("offline_entries", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  payload: text("payload").notNull(),
  synced: int("synced", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const cachedProjects = sqliteTable("cached_projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(),
  budget: real("budget").notNull(),
  updatedAt: text("updated_at").notNull(),
});
