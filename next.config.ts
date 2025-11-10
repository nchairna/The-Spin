import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static optimization - removed for API routes support
  // output: 'export',
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Disabled for static export compatibility
  },
  
  // Security headers are handled in vercel.json for static export
};

export default nextConfig;