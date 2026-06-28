import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "TrekBazaar — Find Your Next Trek",
    template: "%s",
  },
  description:
    "TrekBazaar is a marketplace to discover and enquire about treks. Search and filter by region and difficulty.",
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
        <RecentlyViewedProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </RecentlyViewedProvider>
      </body>
    </html>
  );
}
