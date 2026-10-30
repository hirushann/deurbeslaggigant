import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    // Prerendering reads the live WordPress API; keep the build gentle on that host.
    staticGenerationMinPagesPerWorker: 100,
    staticGenerationMaxConcurrency: 4,
    staticGenerationRetryCount: 2,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Product photos come straight from the WordPress media library.
    remotePatterns: [new URL("https://deurbeslaggigant.nl/wp-content/uploads/**")],
  },
  async redirects() {
    // Old WooCommerce URLs. Products and nested categories live at the root on the old site;
    // those are resolved by app/[...legacy].
    return [
      { source: "/merk/:slug", destination: "/merken/:slug", permanent: true },
      { source: "/winkelwagen-2", destination: "/winkelwagen", permanent: true },
      { source: "/wishlist", destination: "/favorieten", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
