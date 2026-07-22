import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thetirtayasa.my.id"),
  title: {
    default: "Abdul F. Tirtayasa | Data Analyst & AI Enabler",
    template: "%s | Abdul F. Tirtayasa",
  },
  description:
    "Portfolio for Abdul F. Tirtayasa, a Data Analyst & AI Enabler delivering analytics, automation, and AI solutions for business needs.",
  openGraph: {
    title: "Abdul F. Tirtayasa | Data Analyst & AI Enabler",
    description:
      "Data analytics, automation, and AI solutions aligned with business goals.",
    url: "https://thetirtayasa.my.id",
    siteName: "Abdul F. Tirtayasa Portfolio",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
