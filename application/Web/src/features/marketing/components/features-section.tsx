import { marketingFeatures } from "../data/features";

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Features
          </span>
          <h2 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            One platform for every job site
          </h2>
          <p className="mt-4 text-base text-white/60">
            Replace scattered spreadsheets, WhatsApp groups, and paper logs with a single system
            that ties site activity to project finances in real time.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {marketingFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col gap-4 bg-black/60 p-8 backdrop-blur-sm transition-colors hover:bg-black/40"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="font-mono text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
