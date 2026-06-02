import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Sidebar goes here */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
