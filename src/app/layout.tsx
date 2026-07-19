import type { Metadata } from "next";
import { Anek_Malayalam, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { ThemeProvider } from "@/components/site/theme-provider";
import { createMetadata, organizationJsonLd, personJsonLd } from "@/lib/site";
import "./globals.css";

const anekMalayalam = Anek_Malayalam({
  variable: "--font-anek-malayalam",
  subsets: ["latin", "malayalam"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...createMetadata(),
  applicationName: "Mueenuddeen Baqavi Knowledge Platform",
  manifest: "/manifest.webmanifest",
  category: "education",
  appleWebApp: {
    title: "Mueenuddeen Baqavi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" suppressHydrationWarning className={`${anekMalayalam.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={personJsonLd} />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
