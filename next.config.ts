import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships a WASM binary located via runtime path/URL resolution that
  // Turbopack's server bundling mishandles (surfaces as "path argument must be
  // of type string ... Received an instance of URL"). Excluding it from the
  // bundle lets Node load it natively from node_modules instead. Only touches
  // local dev — this package is never reached once DATABASE_URL is set.
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
