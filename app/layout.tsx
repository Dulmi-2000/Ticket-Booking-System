import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import {Analytics} from "@vercel/analytics/next";
import {Toaster} from "@/components/ui/sonner";
import {AuthProvider} from "@/lib/auth-context";
import { ThemeProvider } from "./providers"
import "./globals.css";

const inter = Inter({subsets: ["latin"], variable: "--font-inter"});

export const metadata: Metadata = {
  title: "BookMySeat - Your Ultimate Sri Lankan Event Ticketing Partner",
  description:
    "Find and book tickets for the best concerts, sports, theater, and local events across Sri Lanka with BookMySeat.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "#0a0c1f"},
    {media: "(prefers-color-scheme: dark)", color: "#060713"},
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
