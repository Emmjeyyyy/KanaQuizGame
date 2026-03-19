import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable prefetching for better navigation
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept in the buffer
    pagesBufferLength: 3,
  },
};

export default nextConfig;
