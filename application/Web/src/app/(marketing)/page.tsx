import type { Metadata } from "next";

import { AboutSection } from "@/features/marketing/components/about-section";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { FeaturesSection } from "@/features/marketing/components/features-section";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { PricingSection } from "@/features/marketing/components/pricing-section";
import { siteMeta } from "@/features/marketing/data/site";

export const metadata: Metadata = {
  title: `${siteMeta.name} — ${siteMeta.tagline}`,
  description: siteMeta.description,
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <AboutSection />
      <CtaSection />
    </>
  );
}
