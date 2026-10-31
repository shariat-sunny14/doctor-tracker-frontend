const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The browser only ever talks to THIS origin (/api/...). Next.js proxies to the Express API, so the
  // session cookie is first-party (HttpOnly, SameSite=Lax) and no CORS / third-party-cookie problems exist.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/v1/:path*` }];
  },
};

export default nextConfig;
