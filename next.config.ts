import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Increase serverless function timeout for OCR processing
    serverExternalPackages: ["tesseract.js"],
    experimental: {
        serverActions: {
            bodySizeLimit: "12mb",
        },
    },
};

export default nextConfig;
