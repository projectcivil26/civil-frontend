export const marketingNavLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About us" },
  { href: "/register", label: "Sign up" },
] as const;

export const marketingFooterLinks = {
  product: [
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/book-demo", label: "Book a demo" },
  ],
  company: [
    { href: "/#about", label: "About us" },
    { href: "mailto:hello@sitestack.app", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;

export const siteMeta = {
  name: "SiteStack",
  tagline: "The operating system for civil construction",
  description:
    "SiteStack unifies projects, resources, procurement, and finance into a single platform — so your sites run leaner and your data stays one source of truth.",
} as const;
