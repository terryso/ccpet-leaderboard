import type { Metadata } from "next";
// Temporarily disable Google Fonts to prevent connection issues
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "CCPET Ranking",
  description: "CCPET Ranking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-94EP3Y5VDG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-94EP3Y5VDG');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="antialiased h-full overflow-hidden">
        <ErrorBoundary>
          <ClientBody>{children}</ClientBody>
        </ErrorBoundary>
      </body>
    </html>
  );
}
