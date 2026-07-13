import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://maps.googleapis.com https://www.googletagmanager.com https://www.googleadservices.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: https://www.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const pageSecurityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: isProd,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [256, 384, 640],
    qualities: [75, 80, 85, 90],
    minimumCacheTTL: isProd ? 0 : 60 * 60 * 24 * 30,
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
    ...(isProd
      ? {
          staleTimes: { dynamic: 0, static: 1800 },
        }
      : {
          staleTimes: { dynamic: 1800, static: 86400 },
        }),
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
                value: "public, s-maxage=3600, stale-while-revalidate=86400",
              },
            ],
          },
        ]
      : [];

    return [
      {
        source:
          "/((?!_next/static|_next/image|images|icon|apple-icon|manifest|robots|sitemap|favicon).*)",
        headers: pageSecurityHeaders,
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
      {
        source: "/logo-:width.webp",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      ...pageCache,
    ];
  },
};

export default nextConfig;
