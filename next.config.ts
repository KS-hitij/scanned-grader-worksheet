import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["chromadb", "@chroma-core/google-gemini", "pdf-parse"],
};

export default nextConfig;
