import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.thum.io" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/placeholder-project.svg" },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
