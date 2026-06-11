import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { PublicFooterChrome } from "@/components/layout/PublicChrome";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { BookConsultationFloat } from "@/components/layout/BookConsultationFloat";
import { LiveChat } from "@/components/layout/LiveChat";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains"
});

export const metadata: Metadata = buildMetadata({});

export const viewport: Viewport = {
  themeColor: "#0C447C",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-navy text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        <AuthSessionProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <PublicFooterChrome />
        </AuthSessionProvider>

        <WhatsAppFloat />
        <BookConsultationFloat />
        <LiveChat />

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });`}
            </Script>
          </>
        )}

        {/* Organization schema (spec §9.2). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/logo.svg`,
              sameAs: [
                siteConfig.social.facebook,
                siteConfig.social.instagram,
                siteConfig.social.linkedin,
                siteConfig.social.youtube,
                siteConfig.social.twitter
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: siteConfig.offices[0].address,
                addressLocality: siteConfig.offices[0].city,
                addressCountry: siteConfig.offices[0].country
              }
            })
          }}
        />
      </body>
    </html>
  );
}
