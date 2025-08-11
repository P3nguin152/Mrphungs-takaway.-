import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyOrderCTA from "@/components/StickyOrderCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mr. Phung's Takeaway - Authentic Chinese Cuisine",
  description: "Order delicious, authentic Chinese food online from Mr. Phung's Takeaway in Leeds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
          {children}
        </div>
        <Footer />
        <StickyOrderCTA />
      </body>
    </html>
  );
}
