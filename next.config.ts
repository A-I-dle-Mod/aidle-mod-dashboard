import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://cdn.discordapp.com/avatars/*/*.webp?size=256'),
      new URL('https://cdn.discordapp.com/icons/*/*.png?size=1024'),
    ],
  },
  output: "standalone"
};

export default nextConfig;
