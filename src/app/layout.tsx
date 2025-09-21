import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Tra-verse",
  "description": "Adventure on your terms with travel plans tailored perfectly to your style and interests!",
  "url": "https://tra-verse.vercel.app",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free AI-powered travel planning"
  },
  "creator": {
    "@type": "Organization",
    "name": "Tra Verse",
    "url": "https://tra-verse.vercel.app"
  },
  "featureList": [
    "AI-generated personalized itineraries",
    "Smart interactive maps",
    "Instant booking integration",
    "Weather-adaptive planning",
    "Local insights and recommendations",
    "24/7 AI support"
  ],
  "screenshot": {
    "@type": "ImageObject",
    "url": "https://tra-verse.vercel.app/tra-verse.jpg",
    "width": 1200,
    "height": 630
  }
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tra-verse: Your Trip, Your Way.",
  description: "Adventure on your terms with travel plans tailored perfectly to your style and interests!",
  keywords: "AI travel planning, personalized itineraries, smart travel maps, instant booking, travel technology, adventure planning, trip planning app, AI travel assistant",
  authors: [{ name: "Tra Verse Team" }],
  creator: "Tra Verse",
  publisher: "Tra Verse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tra-verse.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tra-verse: Your Trip, Your Way.",
    description: "Adventure on your terms with travel plans tailored perfectly to your style and interests!",
    url: 'https://tra-verse.vercel.app',
    siteName: 'Tra Verse',
    images: [
      {
        url: 'https://tra-verse.vercel.app/tra-verse.jpg',
        width: 1200,
        height: 630,
        alt: 'Tra-verse: Your Trip, Your Way - Adventure on your terms with personalized travel planning',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tra-verse: Your Trip, Your Way.",
    description: "Adventure on your terms with travel plans tailored perfectly to your style and interests!",
    images: ['https://tra-verse.vercel.app/tra-verse.jpg'],
    creator: '@traverse_ai',
    site: '@traverse_ai',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon Implementation - Comprehensive for all devices */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Standard Favicon Sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

        {/* Apple Touch Icons - iOS Devices */}
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />

        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="36x36" href="/android-chrome-36x36.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/android-chrome-48x48.png" />
        <link rel="icon" type="image/png" sizes="72x72" href="/android-chrome-72x72.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/android-chrome-96x96.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/android-chrome-128x128.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/android-chrome-144x144.png" />
        <link rel="icon" type="image/png" sizes="152x152" href="/android-chrome-152x152.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/android-chrome-256x256.png" />
        <link rel="icon" type="image/png" sizes="384x384" href="/android-chrome-384x384.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

        {/* General Purpose Icons */}
        <link rel="icon" type="image/png" sizes="24x24" href="/icon-24x24.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/icon-64x64.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/icon-128x128.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/icon-256x256.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00d4aa" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000000" />

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />

        {/* Preload critical resources */}
        <link rel="preload" href="/tra-verse.jpg" as="image" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
