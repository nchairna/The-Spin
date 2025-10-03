import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization
  output: 'export',
  trailingSlash: true,
  
  // Image optimization for static export
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