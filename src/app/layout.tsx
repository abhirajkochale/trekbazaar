import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WishlistProvider } from "@/providers/WishlistProvider";
import { RecentlyViewedProvider } from "@/providers/RecentlyViewedProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "TrekBazaar — Find Your Next Himalayan Adventure",
    template: "%s | TrekBazaar",
  },
  description:
    "TrekBazaar is India's premium marketplace for high-altitude treks. Compare verified operators, find the best prices, and book your departure in minutes.",
  keywords: ["trekking", "himalayas", "adventure", "booking", "india treks"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "TrekBazaar — Find Your Next Himalayan Adventure",
    description: "Compare verified operators, find the best prices, and book your departure in minutes.",
    siteName: "TrekBazaar",
    images: [{
      url: "/og-image.jpg", // Placeholder for future graphic
      width: 1200,
      height: 630,
      alt: "TrekBazaar Cover",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrekBazaar — Find Your Next Himalayan Adventure",
    description: "Compare verified operators, find the best prices, and book your departure in minutes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Analytics Foundation */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

        <RecentlyViewedProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </RecentlyViewedProvider>
      </body>
    </html>
  );
}
