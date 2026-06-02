import { cn } from "@/lib/utils";

interface SiteStackLogoProps {
  className?: string;
  showWordmark?: boolean;
}

// SiteStack brand mark — three stacked gold blocks tapering upward.
// Use `text-white`/`text-brand-navy` on the parent to color the wordmark
// (icon stays gold by design).
export function SiteStackLogo({
  className,
  showWordmark = true,
}: SiteStackLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 60 60"
        fill="none"
        aria-hidden
        className="size-9 shrink-0"
      >
        <rect x="2" y="42" width="56" height="12" rx="1.5" fill="#C9974A" />
        <rect x="10" y="26" width="40" height="12" rx="1.5" fill="#C9974A" />
        <rect x="18" y="10" width="24" height="12" rx="1.5" fill="#C9974A" />
      </svg>
      {showWordmark && (
        <span className="text-xl font-semibold tracking-tight text-current">
          site stack
        </span>
      )}
    </div>
  );
}
