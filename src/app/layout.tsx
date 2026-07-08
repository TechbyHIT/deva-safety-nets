import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlobalSeoIntentLinks } from "@/components/GlobalSeoIntentLinks";
import { ClientEnhancements } from "@/components/ClientEnhancements";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { buildGlobalSeoKeywords } from "@/lib/seo-intents";
import { PAGE_IMAGES } from "@/lib/images";
import { site } from "@/lib/site";

export const revalidate = 86400;
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
  preload: true,
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
        <link rel="preload" as="image" href={PAGE_IMAGES.hero} fetchPriority="high" />
        <link rel="preload" as="image" href={PAGE_IMAGES.logo} />
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
        <GlobalSeoIntentLinks />
        <Footer />
        <ClientEnhancements />
      </body>
    </html>
  );
}
