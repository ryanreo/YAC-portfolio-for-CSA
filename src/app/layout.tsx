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
  title: "SRHR Youth Advocacy Champions — Digital Portfolio | CSA Kenya",
  description:
    "SRHR Youth Advocacy Champions — Turning lived experience into policy evidence across Kenya. Verified champion profiles, impact areas, and thematic expertise — CSA Kenya • INSPIRE Lab.",
  keywords: [
    "CSA Kenya",
    "Youth Advocacy Champions",
    "SRHR",
    "Evidence to Policy",
    "INSPIRE-Kenya",
    "Adolescent Health",
    "Digital Portfolio",
  ],
  authors: [{ name: "Centre for the Study of Adolescence (CSA Kenya)" }],
  openGraph: {
    title: "SRHR Youth Advocacy Champions — Digital Portfolio",
    description:
      "SRHR Youth Advocacy Champions — Turning lived experience into policy evidence. Verified profiles, impact areas, and thematic expertise across Kenya.",
    siteName: "CSA Kenya — INSPIRE Lab",
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
