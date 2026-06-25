import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile sits in the parent dir).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
