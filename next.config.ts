import type { NextConfig } from "next";

const repo = "digital-pet";
const usingGitHubPages = process.env.GITHUB_PAGES !== "false";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Project Pages URL is https://pinkpelara.github.io/digital-pet/
  basePath: usingGitHubPages ? `/${repo}` : "",
  assetPrefix: usingGitHubPages ? `/${repo}` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: usingGitHubPages ? `/${repo}` : "",
  },
};

export default nextConfig;
