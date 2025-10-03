import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Outfit, Poppins } from 'next/font/google';
import "./globals.css";

const ebGaramond = localFont({
  src: '../../public/fonts/EBGaramond08-Regular.otf',
  variable: '--font-eb-garamond',
  display: 'swap',
});

const ebGaramondAlt = localFont({
  src: '../../public/fonts/EBGaramond12-Regular.ttf',
  variable: '--font-eb-garamond-alt',
  display: 'swap',
});

const ebGaramondItalic = localFont({
  src: '../../public/fonts/EBGaramond12-Italic.otf',
  variable: '--font-eb-garamond-italic',
  display: 'swap',
});

const paradoese = localFont({
  src: '../../public/fonts/Ws Paradose Demo.ttf',
  variable: '--font-paradoese',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
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
    <html lang="en" className={`${ebGaramond.variable} ${ebGaramondAlt.variable} ${ebGaramondItalic.variable} ${paradoese.variable} ${outfit.variable} ${poppins.variable}`}>
      <body className={`font-eb-garamond ${ebGaramond.variable} ${ebGaramondAlt.variable} ${ebGaramondItalic.variable} ${paradoese.variable} ${outfit.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
