import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rangga Arsy Prawira",
  description: "Website Portfolio Rangga Arsy Prawira",
  openGraph : {
    title : "Rangga Arsy Prawira",
    description : "Website Portfolio Rangga Arsy Prawira",
    images : "/assets/images/rangga_arsy_prawira.png"
  },
  verification : {
    google :"NsgML0qvjroVTwox42Mg8SxR7taic6J2XW2D3S6d0VQ"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
