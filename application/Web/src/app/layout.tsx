import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteStack ERP",
  description: "Civil Construction ERP — Project, Resource & Finance Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Providers>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
