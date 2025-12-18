import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import PageTemplate from "@/components/PageTemplate";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoSlab.variable} font-sf-pro antialiased`}
      >
        <PageTemplate>
          <PageTransition>{children}</PageTransition>
        </PageTemplate>
      </body>
    </html>
  );
}
