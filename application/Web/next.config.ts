import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake heavy barrel-export packages at import time. Cuts the number
  // of modules webpack/Turbopack has to walk for every dev compile.
  // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "@tanstack/react-query",
      "radix-ui",
    ],
  },
};

export default nextConfig;
