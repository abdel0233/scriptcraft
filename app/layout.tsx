import type { Metadata } from "next";
import { Inter, Syne, Cairo } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/useTranslation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScriptCraft — AI-Powered UGC Script Generator",
  description:
    "Fill in your brand brief and receive AI-generated UGC scripts in multiple languages, delivered directly to your inbox.",
  keywords: "UGC scripts, AI content, brand brief, TikTok scripts, social media",
  openGraph: {
    title: "ScriptCraft",
    description: "Fill in your brand brief — AI-generated UGC scripts delivered to your inbox.",
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
      <body
        className={`${inter.variable} ${syne.variable} ${cairo.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
