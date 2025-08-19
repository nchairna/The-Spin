import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Outfit } from 'next/font/google';
import "./globals.css";

const ebGaramond = localFont({
  src: '../../public/fonts/EBGaramond12-Regular.ttf',
  variable: '--font-eb-garamond',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Spin - Podcast",
  description: "Discover the latest episodes of our podcast where we explore technology, business, and the stories that shape our digital world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${outfit.variable}`}>
      <body className={`font-eb-garamond ${ebGaramond.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
