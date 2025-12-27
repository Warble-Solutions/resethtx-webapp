import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from './components/Footer'
import FloatingSocials from './components/FloatingSocials'
// 1. Import the NEW Google Fonts
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Reset HTX",
  description: "Experience the vibe.",
  icons: {
    icon: '/logos/fav.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply the NEW variables to the body */}
      <body
        className={`${cinzel.variable} ${manrope.variable} antialiased bg-black text-white selection:bg-gold-500 selection:text-black`}
      >
        <Navbar />
        {children}
        <FloatingSocials />
        <Footer />
      </body>
    </html>
  );
}