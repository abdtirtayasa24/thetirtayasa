import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abdul F. Tirtayasa | Data Analyst & AI Enabler",
  description: "Portfolio for Abdul F. Tirtayasa, a Data Analyst & AI Enabler delivering analytics, automation, and AI solutions for business needs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
