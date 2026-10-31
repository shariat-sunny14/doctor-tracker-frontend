const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

// Fail the Vercel build loudly instead of shipping a site whose API calls silently go to localhost.
if (process.env.VERCEL && !process.env.BACKEND_URL) {
  throw new Error(
    "BACKEND_URL is not set. In Vercel: Project > Settings > Environment Variables > BACKEND_URL = https://<your-backend>.vercel.app, then redeploy."
  );
}

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
