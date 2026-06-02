import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — SiteStack ERP" };

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome to SiteStack ERP
      </p>
      {/* Dashboard widgets go here */}
    </div>
  );
}
