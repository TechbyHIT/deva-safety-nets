import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DeferredGlobalSeoIntentLinks } from "@/components/DeferredGlobalSeoIntentLinks";
import { DeferredClientEnhancements } from "@/components/DeferredClientEnhancements";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { buildGlobalSeoKeywords } from "@/lib/seo-intents";
import { LOGO_DEFAULT_SRC, LOGO_SIZES, LOGO_SRCSET } from "@/lib/logo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Invisible Grills & Safety Nets Kerala`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: buildGlobalSeoKeywords(),
  applicationName: site.name,
  authors: [{ name: site.name }],
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          as="image"
          href={LOGO_DEFAULT_SRC}
          imageSrcSet={LOGO_SRCSET}
          imageSizes={LOGO_SIZES}
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pb-36 md:pb-40">
          {children}
        </main>
        <DeferredGlobalSeoIntentLinks />
        <Footer />
        <GoogleAdsTag />
        <DeferredClientEnhancements />
      </body>
    </html>
  );
}
