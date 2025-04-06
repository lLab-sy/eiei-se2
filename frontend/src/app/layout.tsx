import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import AuthContext from "@/components/AuthProvider";
import ReduxProvider from "@/components/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bualoi - A Professional Network for Creative Talent",
  description: "A Professional Network for Creative Talent",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <head></head>
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
