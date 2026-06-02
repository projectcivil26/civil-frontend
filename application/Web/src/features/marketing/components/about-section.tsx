const stats = [
  { value: "1 platform", label: "Replaces 6+ tools across site, office, and finance." },
  { value: "Real-time", label: "Field data flows directly into project ledgers." },
  { value: "Built-in", label: "Approvals, audit trails, and compliance from day one." },
];

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              About us
            </span>
            <h2 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Construction software, written by people who&apos;ve been to the site.
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-base leading-relaxed text-white/70">
            <p>
              Civil construction is run on judgment calls — but the data that informs those
              calls is scattered across notebooks, WhatsApp groups, and four different
              spreadsheets. We built SiteStack to put that data in one place, structured and
              live, so contractors can spend less time chasing information and more time
              building.
            </p>
            <p>
              Every workflow in SiteStack is shaped by feedback from project managers, site
              engineers, accountants, and owners who deal with the consequences of bad
              information every day. Our goal is simple: make the truth about your project the
              easiest thing to find.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-black/60 p-8 backdrop-blur-sm">
              <p className="font-mono text-2xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
