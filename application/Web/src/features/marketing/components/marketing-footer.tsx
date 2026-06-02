import Link from "next/link";

import { marketingFooterLinks, siteMeta } from "../data/site";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-mono text-base font-semibold text-white">{siteMeta.name}</p>
          <p className="mt-3 text-sm text-white/60">
            Built for civil contractors who run real projects.
          </p>
        </div>

        <FooterColumn title="Product" links={marketingFooterLinks.product} />
        <FooterColumn title="Company" links={marketingFooterLinks.company} />
        <FooterColumn title="Legal" links={marketingFooterLinks.legal} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-white/50 md:flex-row md:items-center">
          <span>
            &copy; {year} {siteMeta.name}. All rights reserved.
          </span>
          <span>Civil construction ERP.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
