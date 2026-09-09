import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";

/* Atelier Editorial type system — identical families to the reference zip:
   Newsreader for editorial serifs, Manrope for structural sans. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "YAC Digital Portfolio — The 12 Youth Advocacy Champions | CSA Kenya",
  description:
    "The shared portfolio of the 12 YACs — Youth Advocacy Champions driving sub-national change across Kenya. Open each champion's verified portfolio — CSA Kenya • INSPIRE-Kenya Youth Evidence to Policy Lab.",
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
    title: "YAC Digital Portfolio — The 12 Youth Advocacy Champions",
    description:
      "The portfolio of the 12 YACs: verified champion profiles, county footprint, and thematic expertise across Kenya.",
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
      <body className={`${newsreader.variable} ${manrope.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
