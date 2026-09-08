import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youth Evidence-to-Policy Digital Portfolio | CSA Kenya",
  description:
    "Interactive showcase of 12 Youth Advocacy Champions driving sub-national change across Kenya — CSA Kenya • INSPIRE-Kenya Youth Evidence to Policy Lab.",
  keywords: [
    "CSA Kenya",
    "Youth Advocacy",
    "Evidence to Policy",
    "INSPIRE-Kenya",
    "SRHR",
    "Youth Champions",
    "Digital Portfolio",
  ],
  authors: [{ name: "Centre for the Study of Adolescence (CSA Kenya)" }],
  openGraph: {
    title: "Youth Evidence-to-Policy Digital Portfolio",
    description:
      "12 Youth Advocacy Champions driving sub-national change across Kenya. Explore verified profiles, county footprint, and thematic expertise.",
    siteName: "CSA Kenya — INSPIRE-Kenya Youth Evidence to Policy Lab",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        <Sonner position="bottom-right" />
      </body>
    </html>
  );
}
