import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ReduxProvider from "@/components/ReduxProvider";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useMemo } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display : 'swap'
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display : 'swap'
});

export const metadata: Metadata = {
  title: "Bualoi - A Professional Network for Creative Talent",
  description: "A Professional Network for Creative Talent",
};

const NavBar =  dynamic(() => import("@/components/NavBar"));
const Footer = dynamic(() => import("@/components/Footer"));
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {/* <AuthContext session={session}> */}
          <NavBar session={session} />
          <div className="pt-16">{children}</div>
          <Footer />
          <Toaster />
          {/* </AuthContext> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
