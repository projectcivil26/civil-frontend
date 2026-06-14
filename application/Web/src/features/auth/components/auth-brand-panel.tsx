import type { LucideIcon } from "lucide-react";
import {
  BadgeIndianRupee,
  Boxes,
  Factory,
  FolderKanban,
  HardHat,
  Lightbulb,
  ShoppingCart,
  Truck,
  Wallet,
} from "lucide-react";

import { SiteStackLogo } from "@/components/shared/site-stack-logo";

// Left side of the auth shell. Server component — no client island needed.
// The hub-and-spoke diagram visually communicates "every ERP module ties
// back to one SiteStack workspace."

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

// 8 modules — rendered around a centered SiteStack hub in a 3x3 grid.
// Order matches the visual layout (left→right, top→bottom, skipping the hub).
const erpModules: ReadonlyArray<{ icon: LucideIcon; label: string }> = [
  { icon: FolderKanban, label: "Project Management" },
  { icon: HardHat, label: "Labour Management" },
  { icon: Truck, label: "Supplier Management" },
  { icon: ShoppingCart, label: "Purchase Management" },
  // ── hub goes here in the rendered grid (between index 3 and 4) ──
  { icon: Boxes, label: "Inventory Management" },
  { icon: Factory, label: "Production Management" },
  { icon: Wallet, label: "Budget Management" },
  { icon: BadgeIndianRupee, label: "Payroll Management" },
];

// SVG viewBox coordinates of each module's center on the 3x3 grid (in order
// matching erpModules). Lines run from each of these to (50, 50) — the hub.
const spokeOrigins: ReadonlyArray<readonly [number, number]> = [
  [16.67, 16.67],
  [50, 16.67],
  [83.33, 16.67],
  [16.67, 50],
  [83.33, 50],
  [16.67, 83.33],
  [50, 83.33],
  [83.33, 83.33],
];

export function AuthBrandPanel({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  tip,
}: AuthBrandPanelProps) {
  return (
    <aside className={panelStyles}>
      <div className={gradientStyles} aria-hidden />

      {/* Top row: logo (left), headline pinned to the right edge */}
      <div className="relative z-10 flex items-start justify-between gap-6">
        <SiteStackLogo />
        <h2 className="max-w-xs text-right text-3xl font-bold leading-tight text-white sm:text-4xl">
          {title}
        </h2>
      </div>

      {/* Center: hub-and-spoke ERP block diagram */}
      <div className="relative z-10 my-10 flex flex-1 items-center justify-center">
        <div
          className="relative aspect-square w-full max-w-md"
          role="img"
          aria-label="SiteStack unifies eight ERP modules in one workspace"
        >
          {/* Connector lines — drawn underneath the cards so the spokes appear
              to feed into each module. preserveAspectRatio=none lets the lines
              stretch with the (square) container so cell centers always align. */}
          <svg
            className="pointer-events-none absolute inset-0 size-full text-white"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {spokeOrigins.map(([x, y]) => (
              <line
                key={`${x}-${y}`}
                x1={x}
                y1={y}
                x2={50}
                y2={50}
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={0.4}
                strokeDasharray="1.8 1.4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* 3x3 grid — 8 modules around the SiteStack hub */}
          <ul className="grid size-full grid-cols-3 grid-rows-3 gap-2.5">
            {erpModules.slice(0, 4).map((m) => (
              <ModuleCard key={m.label} {...m} />
            ))}
            <HubCard />
            {erpModules.slice(4).map((m) => (
              <ModuleCard key={m.label} {...m} />
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom: supporting description + optional tip */}
      <div className="relative z-10 max-w-md">
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

function ModuleCard({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <li className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.08] p-2 text-center backdrop-blur-sm">
      <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="text-[11px] font-medium leading-tight text-white/90">
        {label}
      </span>
    </li>
  );
}

// The central SiteStack "platform" tile — visually distinct (solid white) so
// users immediately read it as the platform every module connects into.
function HubCard() {
  return (
    <li className="relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-white bg-white p-2 text-center shadow-lg shadow-black/30">
      <SiteStackLogo showWordmark={false} className="text-[#1C3A5E]" />
      <span className="text-[11px] font-bold leading-tight text-[#1C3A5E]">
        SiteStack
      </span>
    </li>
  );
}
