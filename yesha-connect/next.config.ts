import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve this Next.js app under the /yesha-connect sub-path
  // so it can be proxied from yeshaenterprises.in/yesha-connect
  basePath: "/yesha-connect",
  assetPrefix: "/yesha-connect",
};

export default nextConfig;
