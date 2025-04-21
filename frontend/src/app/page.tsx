// src/app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Search, Briefcase } from "lucide-react";
import Banner from "@/components/Banner";
import Script from "next/script";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-mainblue mb-3">
              Welcome to BualoiDev
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A platform connecting media producers and production
              professionals. Easily find projects or talent that match your
              needs.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-mainblue" />
                For Everyone in the Industry
              </h3>
              <p className="text-gray-600 mb-4">
                Whether you're a producer, director, or crew member, join our
                creative community to discover opportunities and connect with
                industry professionals.
              </p>
              {/* <div className="flex gap-3">
                <Link href="/register" className="flex-1">
                  <Button className="w-full">Sign Up</Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Search className="h-6 w-6 text-mainblue" />
              </div>
              <h3 className="font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">
                Find projects and professionals that match your exact needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-mainblue" />
              </div>
              <h3 className="font-semibold mb-2">Network & Collaborate</h3>
              <p className="text-gray-600 text-sm">
                Connect with top-tier producers and professionals in the
                industry.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Briefcase className="h-6 w-6 text-mainblue" />
              </div>
              <h3 className="font-semibold mb-2">Easy Project Management</h3>
              <p className="text-gray-600 text-sm">
                Our intuitive system helps your work flow smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Script
        src="https://cdn.omise.co/omise.js"
        onLoad={() => {
          (window as any).Omise?.setPublicKey(
            process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!
          );
        }}
      /> */}
    </div>
  );
}
