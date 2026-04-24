import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["langchain",
    "@langchain/core",
    "@langchain/langgraph",
    "@langchain/google-genai",
    "@langchain/community",
    "chromadb",
    "@chroma-core/google-gemini",
    "pdf-parse",
    "@google/genai",],
};

export default nextConfig;
