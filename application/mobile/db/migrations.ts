import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "./index";
import migrations from "./migrations/migrations";

export function useDatabaseMigrations() {
  return useMigrations(db, migrations);
}
