import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
};

module.exports = {
  allowedDevOrigins: ['100.110.69.59'],
}

export default nextConfig;
