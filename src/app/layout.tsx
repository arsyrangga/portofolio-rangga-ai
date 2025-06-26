import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
