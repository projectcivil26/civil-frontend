import { Lightbulb } from "lucide-react";

import { SiteStackLogo } from "@/components/shared/site-stack-logo";
import { FloatingPaths } from "./floating-paths";

// Left side of the auth shell. Server component — no interactivity required.
// FloatingPaths is the only client island here.
// Copy is prop-driven so /login and /register can share the gradient + motion
// without duplicating the panel component.

interface AuthBrandPanelProps {
  // Big headline on the top right. Defaults to the register-page copy.
  title?: React.ReactNode;
  // Supporting paragraph at the bottom-left.
  description?: React.ReactNode;
  // Optional callout pinned bottom-left (used on /login as the "TIP" box).
  tip?: { eyebrow: string; body: React.ReactNode };
}

const panelStyles =
  "relative hidden h-full flex-col overflow-hidden p-10 text-white lg:flex";
const gradientStyles =
  "absolute inset-0 bg-gradient-to-br from-[#0F2C4E] via-[#155B6B] to-[#0FA9A4]";
const tipStyles =
  "relative z-10 mt-6 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm";

const DEFAULT_TITLE = (
  <>
    Run every site
    <br />
    from one place.
  </>
);
const DEFAULT_DESCRIPTION =
  "Attendance, payroll, vendor bills, inventory, and finance — built for civil construction firms in India.";

export function AuthBrandPanel({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  tip,
}: AuthBrandPanelProps) {
  return (
    <aside className={panelStyles}>
      <div className={gradientStyles} aria-hidden />
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      {/* Top row: logo on the left, headline pinned to the right edge */}
      <div className="relative z-10 flex items-start justify-between gap-6">
        <SiteStackLogo />
        <h2 className="max-w-xs text-right text-3xl font-bold leading-tight text-white sm:text-4xl">
          {title}
        </h2>
      </div>

      {/* Bottom: supporting description + optional tip stay bottom-left */}
      <div className="relative z-10 mt-auto max-w-md">
        <p className="text-base leading-relaxed text-white/80">{description}</p>

        {tip && (
          <div className={tipStyles}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-200">
              <Lightbulb className="size-3.5" aria-hidden />
              {tip.eyebrow}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-white/85">
              {tip.body}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
