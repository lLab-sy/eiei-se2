'use client'

import { useState,useReducer } from "react";
import { Project } from "../../interface";
import PostHistoryCard from "./PostHistoryCard";
import PaginationBar from "./PostHistoryPaginationBar";
import Link from "next/link";

export default function PostHistoryList({postLists}:{postLists:Project[]}){
    const [currentPage, setCurrentPage] = useState<number>(1);

    const projectsPerPage = 10;
    const startIndex = (currentPage - 1) * projectsPerPage; //เริ่มตรงไหนใน pagesToShow
    const currentProjects = postLists.slice( //เอาอันไหนมาแสดงบ้าง
        startIndex,
        startIndex + projectsPerPage //projectPerPage
      );


    return(
      <div className="bg-slate-300">
        <div className="grid grid-cols-2 gap-4">
        {currentProjects.map((project) => (
          <Link href={`/post/${project.id}`}
            key={project.id}
          >
            <PostHistoryCard post={project}/>
          </Link>
        ))}
      </div>
      {/* Pagination */} 
       
          <PaginationBar currentPage={currentPage} projectsPerPage={projectsPerPage} postListLenght={postLists.length} setCurrentPage={setCurrentPage}/>
         
      </div>)
}