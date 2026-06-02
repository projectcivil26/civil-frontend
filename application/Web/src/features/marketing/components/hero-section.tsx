import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { siteMeta } from "../data/site";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20 text-center"
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/3 -z-0 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full",
          "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_60%)]",
          "blur-3xl",
        )}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Built for civil contractors
        </span>

        <h1 className="mt-6 font-mono text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {siteMeta.tagline}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          {siteMeta.description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="border border-white/15 text-white hover:bg-white/10"
          >
            <Link href="/book-demo">Book a Demo</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-white/40">
          No credit card required. Talk to our team to onboard your first project.
        </p>
      </div>
    </section>
  );
}
