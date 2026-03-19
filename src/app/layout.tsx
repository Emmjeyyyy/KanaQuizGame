import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { PageTransitionProvider } from "./components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kana Quiz Game",
  description: "Japanese Learning App - Master Hiragana, Katakana, and Kanji",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-primary text-text-primary`}
        suppressHydrationWarning
      >
        <PageTransitionProvider>
          <Navbar />
          <div className="flex flex-col min-h-screen pt-16">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
