import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 px-8 py-16 text-center backdrop-blur-md md:px-16">
        <h2 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Streamline your sites. Start today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/60">
          Onboard your first project in under a week. Talk to our team to see how SiteStack fits
          your workflow.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
      </div>
    </section>
  );
}
