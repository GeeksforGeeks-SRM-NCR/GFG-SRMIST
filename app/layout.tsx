import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import TopLoader from './components/TopLoader';
import SmoothScroll from './components/SmoothScroll';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GeeksForGeeks-SRMIST",
  description: "",
  icons: {
    icon: "./titlelogo.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

import { contentfulClient } from '@/lib/contentful';
import RecruitmentNotification from './components/RecruitmentNotification';

async function getRecruitmentStatus() {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'globalSettings',
      limit: 1
    });

    if (entries.items.length > 0) {
      return entries.items[0].fields.isRecruitmentOpen || false;
    }
    return false;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return false;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isRecruitmentOpen = await getRecruitmentStatus();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoSlab.variable} font-sf-pro antialiased`}
      >
        <SmoothScroll />
        <TopLoader />
        <RecruitmentNotification isRecruitmentOpen={isRecruitmentOpen} />
        {children}
      </body>
    </html>
  );
}
