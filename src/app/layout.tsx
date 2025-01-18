import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import ProviderWrapper from "./components/ProviderWrapper";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "ReelDash",
   description: "Enjoy seemless reels experience",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className="">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex`}
         >
            <ProviderWrapper>{children}</ProviderWrapper>
            <Toaster />
         </body>
      </html>
   );
}
