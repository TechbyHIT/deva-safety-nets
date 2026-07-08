import type { NextConfig } from "next";

// Sitemap is served as an index (/sitemap.xml) + segmented shards
// (/sitemaps/[id].xml) via route handlers, so it scales past the 50k-URL limit.
const isProd = process.env.NODE_ENV === "production";
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' for its inline runtime bootstrap; in prod
  // prefer nonces via middleware if you tighten this further.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://maps.googleapis.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [256, 384, 640],
    qualities: [75, 80, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    staleTimes: {
      dynamic: 1800,
      static: 86400,
    },
  },
  compiler: isProd
    ? {
        removeConsole: { exclude: ["error", "warn"] },
      }
    : undefined,
  async headers() {
    const pageCache = isProd
      ? [
          {
            source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=86400",
              },
            ],
          },
        ]
      : [];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      ...pageCache,
    ];
  },
};

export default nextConfig;
