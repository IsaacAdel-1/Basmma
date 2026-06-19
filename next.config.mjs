/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // images are already compressed at upload time, and Next's built-in
    // optimizer isn't available on Cloudflare — so serve them as-is.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
