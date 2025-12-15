import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from './components/Footer'
// 1. Import the Google Fonts
import { Oswald, Montserrat } from "next/font/google";
import "./globals.css";

// 2. Configure them
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reset HTX",
  description: "Experience the vibe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply the variables to the body */}
      <body
        className={`${oswald.variable} ${montserrat.variable} antialiased bg-black text-white selection:bg-gold-500 selection:text-black`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}