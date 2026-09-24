/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Media files keep stable names, so cache for a week (not "immutable")
    // and let the CDN refresh in the background.
    const media = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/video/:path*", headers: media },
      { source: "/img/:path*", headers: media },
    ];
  },
};

export default nextConfig;
