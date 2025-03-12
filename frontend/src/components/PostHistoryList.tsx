"use client";

import { useState } from "react";
import { PostDataHistory } from "../../interface";
import PostHistoryCard from "./PostHistoryCard";
import PaginationBar from "./PostHistoryPaginationBar";
import Link from "next/link";

export default function PostHistoryList({
  postLists,
  userName,
  role,
}: {
  postLists: PostDataHistory[] | null;
  userName: string;
  role: string;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 6; // ลดลงเพื่อให้เหมาะกับการแสดง 2 โพสต์ต่อแถว
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = postLists
    ? postLists.slice(startIndex, startIndex + projectsPerPage)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-mainblue mb-4">
            {role === "producer" ? "Project History" : "Work History"}
          </h1>
          <div className="h-1 w-24 bg-mainblue-light mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600">
            {role === "producer"
              ? "Explore your creative projects and collaborations"
              : "View your completed projects and achievements"}
          </p>
        </div>

        {/* Create Post for Producer */}
        {role === "producer" && (
          <div className="mb-6">
            <Link
              href="/create-post"
              className="inline-block px-4 py-2 bg-mainblue text-white rounded-md hover:bg-mainblue-light transition-colors"
            >
              Create Post
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {currentProjects ? (
            currentProjects.map((project, index) => (
              <Link key={index} href={`/post/${project.id}`} className="block">
                <PostHistoryCard
                  post={project}
                  userName={userName}
                  role={role}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No projects found
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <PaginationBar
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            postListLength={postLists ? postLists.length : 0}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
