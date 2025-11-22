import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // Optional: Specify port and pathname if needed, e.g.
        // port: '',
        // pathname: '/photo-1441986300917-64674bd600d8*',
      },
      // You can add other external hosts here
    ],
  },
};

export default nextConfig;
