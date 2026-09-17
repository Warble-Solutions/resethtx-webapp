import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'
import Navbar from "./components/Navbar";
import Footer from './components/Footer'
import FloatingSocials from './components/FloatingSocials'
// 1. Import the NEW Google Fonts
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import AdminHidden from './components/AdminHidden'
import { ReservationProvider } from './context/ReservationContext'
import GlobalReservationModal from './components/GlobalReservationModal'
import { InquireProvider } from './context/InquireContext'
import GlobalInquireModal from './components/GlobalInquireModal'

// 2. Configure them
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel", // Matches your new tailwind config
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope", // Matches your new tailwind config
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resethtx.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Reset HTX | Rooftop Lounge, Craft Cocktails & Dining in Midtown Houston",
    template: "%s | Reset HTX",
  },
  description: "Houston's premier rooftop lounge in Midtown. Featuring craft cocktails, elevated dining, weekday happy hours, private event venue rentals, and curated nightlife.",
  keywords: [
    "Houston rooftop lounge",
    "Midtown Houston lounge",
    "craft cocktails Houston",
    "rooftop dining Houston",
    "private events Houston",
    "happy hour Midtown Houston",
    "Reset HTX",
    "Houston nightlife",
  ],
  authors: [{ name: "Reset HTX" }],
  creator: "Reset HTX",
  publisher: "Reset HTX",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Reset HTX",
    title: "Reset HTX | Rooftop Lounge, Craft Cocktails & Dining in Midtown Houston",
    description: "Houston's premier rooftop lounge in Midtown. Featuring craft cocktails, elevated dining, weekday happy hours, private event venue rentals, and curated nightlife.",
    images: [
      {
        url: "/logos/logo-main.png",
        width: 1200,
        height: 630,
        alt: "Reset HTX Rooftop Lounge & Kitchen Midtown Houston",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset HTX | Rooftop Lounge, Craft Cocktails & Dining in Midtown Houston",
    description: "Houston's premier rooftop lounge in Midtown. Featuring craft cocktails, elevated dining, weekday happy hours, private event venue rentals, and curated nightlife.",
    images: ["/logos/logo-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logos/fav.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 3. Apply the NEW variables to the body */}
      <body
        className={`${cinzel.variable} ${manrope.variable} antialiased bg-black text-white selection:bg-gold-500 selection:text-black`}
      >
        <NextTopLoader
          color="#D4AF37"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
        />
        <ReservationProvider>
          <InquireProvider>
            <GlobalReservationModal />
            <GlobalInquireModal />
            <Navbar />
            {children}
            <AdminHidden>
              <FloatingSocials />
              <Footer />
            </AdminHidden>
          </InquireProvider>
        </ReservationProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}