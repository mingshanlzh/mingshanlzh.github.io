import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
  // basePath: "/your-repo-name", // uncomment when deploying to GitHub Pages subpath
};

export default nextConfig;
