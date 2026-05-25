import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Genomics Institute",
  description: "Advanced predictive modeling and multi-omics integration at Nexus Genomics Institute.",
  verification: {
    google: "-Ja4_hQHDVfjJ98qXSEMrmWXOhRhBYQpY9r3t8lfIVc",
  },
  openGraph: {
    title: "Nexus Genomics Institute",
    description: "Pioneering advanced predictive modeling and multi-omics integration for systems biology.",
    type: "website",
    siteName: "Nexus Genomics Institute",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Genomics Institute",
    description: "Pioneering advanced predictive modeling and multi-omics integration for systems biology.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
