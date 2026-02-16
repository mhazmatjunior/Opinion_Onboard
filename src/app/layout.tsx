import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Opinion Onboard",
  description: "Share opinions that matter. Anonymous or named - your voice, your choice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-surface font-sans antialiased text-foreground",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

