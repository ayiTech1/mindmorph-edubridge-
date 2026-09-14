import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app sits inside a larger workspace that has its own lockfiles; without
  // this Next walks up and picks the wrong directory as the tracing root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
