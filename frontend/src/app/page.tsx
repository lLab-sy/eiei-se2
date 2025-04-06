// src/app/page.tsx
"use client";

import Banner from "@/components/Banner";
// import ShortKeyList from "@/components/ShortKeyList";
import MovieList from "@/components/MovieList";
import ProfessionalList from "@/components/ProfessionalList";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  FileText,
  Search,
  Users,
  History,
  Plus,
  Briefcase,
} from "lucide-react";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeProjects: 0,
    offers: 0,
    completedProjects: 0,
  });

  useEffect(() => {
    // Fetch session data from API
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (data && data.user) {
          setSession(data);
          setUserRole(data.user.role);

          // Fetch statistics (can be refactored to a single API based on user ID)
          try {
            const statsResponse = await fetch(
              `/api/user/stats/${data.user.id}`,
            );
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setStats(statsData.stats);
            }
          } catch (error) {
            console.error("Error fetching user stats:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />

      {/* Content based on session */}
      {session?.user ? (
        <div className="container mx-auto py-6 px-4">
          {/* User and statistics section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-mainblue mb-4">
              Hello, {session.user.username || "User"}!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"></div>

            {/* Role-based shortcut menu buttons */}
            {userRole === "producer" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/create-post" className="w-full">
                  <Button className="w-full bg-mainblue hover:bg-mainblue-light flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Post
                  </Button>
                </Link>
                <Link href="/my-post" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    Manage My Posts
                  </Button>
                </Link>
                <Link href="/my-offering" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    View All Offers
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/posts" className="w-full">
                  <Button className="w-full bg-mainblue hover:bg-mainblue-light flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    Browse Job Posts
                  </Button>
                </Link>
                <Link href="/my-offering" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    My Offers
                  </Button>
                </Link>
                <Link href="/post-history" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <History className="h-5 w-5" />
                    Work History
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Category Section
          <div className="mb-8">
            <ShortKeyList />
          </div> */}

          {/* Role-based content */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-xl font-bold">
                {userRole === "producer"
                  ? "Recommended Professionals"
                  : "Recommended Job Posts"}
              </h2> */}
              <Link
                href={userRole === "producer" ? "/professionals" : "/posts"}
                className="text-mainblue hover:underline flex items-center"
              >
                {/* View All <ChevronRight className="h-4 w-4" /> */}
              </Link>
            </div>
            {userRole === "producer" ? <ProfessionalList /> : <MovieList />}
          </div>
        </div>
      ) : (
        // Section for users not logged in
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

            {/* Platform Intro - Unified for all roles */}
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
                <div className="flex gap-3">
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Platform Features */}
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

          {/* Category Section
          <div className="mb-8">
            <ShortKeyList />
          </div> */}
        </div>
      )}
    </div>
  );
}
