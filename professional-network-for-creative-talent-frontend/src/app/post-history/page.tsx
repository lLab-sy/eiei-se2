'use client'
import PostHistoryList from "@/components/PostHistoryList";
import { Project } from "../../../interface";
import React, { useState } from "react";
import Image from "next/image";


//Mock Data
const projects: Project[] = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    postName: `Project ${i + 1}`,
    postDescription: `Movie`,
    producer: "Producer Lee",
    startDate: "26 October 2024",
    endDate: "26 October 2024",
    postMediaType: "Live Action",
    postProjectRole: "actor",
    postStatus: "success",
    postImages: "/path-to-image.jpg",
  }));



export default function HistoryPostPage(){


  return (
    <div className="p-4">

      {/* Project History */}
      <h2 className="text-2xl font-bold text-center my-4">Post-History</h2>
      <PostHistoryList postLists={projects}/>
    
    </div>
  );
};

 
