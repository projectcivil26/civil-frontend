import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingTier = {
  name: string;
  description: string;
  highlight?: boolean;
  features: string[];
  cta: { label: string; href: string };
};

const tiers: PricingTier[] = [
  {
    name: "Starter",
    description: "For small contractors running a handful of active projects.",
    features: [
      "Up to 5 active projects",
      "Project & resource management",
      "Daily site reports",
      "Email support",
    ],
    cta: { label: "Start free trial", href: "/register" },
  },
  {
    name: "Growth",
    description: "For mid-size firms that need finance, procurement, and analytics in one place.",
    highlight: true,
    features: [
      "Unlimited projects",
      "Finance, billing & procurement",
      "Custom approval workflows",
      "Analytics dashboards",
      "Priority support",
    ],
    cta: { label: "Start free trial", href: "/register" },
  },
  {
    name: "Enterprise",
    description: "For multi-site operators with bespoke compliance and integration needs.",
    features: [
      "Everything in Growth",
      "Dedicated success manager",
      "SSO + audit logs",
      "Integrations & API access",
      "Custom onboarding",
    ],
    cta: { label: "Talk to sales", href: "/book-demo" },
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Pricing
          </span>
          <h2 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Pricing that scales with your sites
          </h2>
          <p className="mt-4 text-base text-white/60">
            Transparent per-project pricing. No per-user gotchas. Detailed pricing on request.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col rounded-2xl border p-8 backdrop-blur-sm",
                tier.highlight
                  ? "border-white/40 bg-white/10"
                  : "border-white/10 bg-black/40",
              )}
            >
              <div>
                <h3 className="font-mono text-xl font-semibold text-white">{tier.name}</h3>
                <p className="mt-2 text-sm text-white/60">{tier.description}</p>
              </div>

              <ul className="mt-6 space-y-3">
                {tier.features.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <Button
                  asChild
                  className={cn(
                    "w-full",
                    tier.highlight
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/15 bg-transparent text-white hover:bg-white/10",
                  )}
                >
                  <Link href={tier.cta.href}>{tier.cta.label}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
