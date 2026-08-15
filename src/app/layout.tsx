import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DeferredGlobalSeoIntentLinks } from "@/components/DeferredGlobalSeoIntentLinks";
import { DeferredClientEnhancements } from "@/components/DeferredClientEnhancements";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { JsonLd } from "@/components/JsonLd";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { buildGlobalSeoKeywords } from "@/lib/seo-intents";
import { LOGO_DEFAULT_SRC } from "@/lib/logo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Invisible Grills & Safety Nets in Kerala | ${site.name}`,
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F0D" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href={LOGO_DEFAULT_SRC} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('deva-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        <ThemeProvider>
          <JsonLd data={[organizationSchema(), websiteSchema()]} />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="pb-28 md:pb-0">
            {children}
          </main>
          <DeferredGlobalSeoIntentLinks />
          <Footer />
          <GoogleAdsTag />
          <DeferredClientEnhancements />
        </ThemeProvider>
      </body>
    </html>
  );
}
