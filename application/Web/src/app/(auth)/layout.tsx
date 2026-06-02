import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// Background-only shell for auth routes.
// Server-side guard: an authenticated user has no business on /login,
// /register, or any of their subroutes — bounce to the dashboard.
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  return <div className="min-h-screen bg-brand-bg">{children}</div>;
}
