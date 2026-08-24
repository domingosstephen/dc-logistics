import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Condensed,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DC Logistics Brasil",
    template: "%s | DC Logistics Brasil",
  },
  description:
    "Rastreamento de envios internacionais. Cada carga tem um número e um status atualizado pela nossa equipe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${ibmPlexSansCondensed.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
