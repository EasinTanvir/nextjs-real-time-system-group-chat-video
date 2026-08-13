/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://group-chat-video.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
