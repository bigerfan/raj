import type { NextConfig } from "next";

const apiUrl = process.env.API_URL;
if (!apiUrl) throw new Error("API_URL is not set");
const uploads = new URL(process.env.API_PUBLIC_URL ?? apiUrl);

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: uploads.protocol.replace(":", "") as "http" | "https",
        hostname: uploads.hostname,
        port: uploads.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
