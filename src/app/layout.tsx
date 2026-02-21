import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { NotificationInitializer } from "@/components/NotificationInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Opinion Onboard",
  description: "Share opinions that matter. Anonymous or named - your voice, your choice.",
  icons: {
    icon: "/icon.svg",
  },
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
        <AuthProvider>
          <ToastProvider>
            <NotificationInitializer />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

