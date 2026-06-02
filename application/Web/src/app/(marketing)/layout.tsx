import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { MarketingHeader } from "@/features/marketing/components/marketing-header";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden text-white">
      <div aria-hidden="true" className="fixed inset-0 -z-20 bg-black" />
      <DottedSurface />
      <MarketingHeader />
      <main className="relative z-10">{children}</main>
      <MarketingFooter />
    </div>
  );
}
