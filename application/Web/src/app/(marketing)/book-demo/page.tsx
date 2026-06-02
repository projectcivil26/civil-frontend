import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo — SiteStack",
  description: "Talk to our team and see how SiteStack fits your sites.",
};

export default function BookDemoPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Book a Demo
        </span>
        <h1 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Demo booking form coming soon
        </h1>
        <p className="mt-4 text-base text-white/60">
          We&apos;re wiring up the booking flow next. In the meantime, drop us a line at{" "}
          <a
            href="mailto:hello@sitestack.app"
            className="text-white underline underline-offset-4 hover:text-white/80"
          >
            hello@sitestack.app
          </a>{" "}
          and we&apos;ll set up a walkthrough.
        </p>
      </div>
    </section>
  );
}
