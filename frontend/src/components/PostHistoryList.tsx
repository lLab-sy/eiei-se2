"use client";

import { useState, useReducer } from "react";
import { PostDataHistory } from "../../interface";
import PostHistoryCard from "./PostHistoryCard";
import PaginationBar from "./PostHistoryPaginationBar";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PostHistoryList({
  postLists,userName,role
}: {
  postLists: PostDataHistory[],
  userName:string,
  role:string
}) {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 10;
  const startIndex = (currentPage - 1) * projectsPerPage; //เริ่มตรงไหนใน pagesToShow
  const currentProjects = postLists.slice(
    //เอาอันไหนมาแสดงบ้าง
    startIndex,
    startIndex + projectsPerPage, //projectPerPage
  );
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {currentProjects.map((project,index) => (
            <div
              key={index}
              className="transform hover:-translate-y-1 transition-transform duration-300"
            >
              <Link href={`/post/${project.id}`}>
                <PostHistoryCard post={project} userName={userName} role={role} />
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <PaginationBar
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            postListLenght={postLists.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
