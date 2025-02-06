'use client'
import PostHistoryList from "@/components/PostHistoryList";
import { Project } from "../../../../../interface";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import getHistoryPost from "@/libs/getHistoryPosts";
import getHistoryPosts from "@/libs/getHistoryPosts";


//Mock Data
// const projects: Project[] = Array.from({ length: 45 }, (_, i) => ({
//     id: i + 1,
//     postName: `Project ${i + 1}`,
//     postDescription: `Movie`,
//     producer: "Producer Lee",
//     startDate: "26 October 2024",
//     endDate: "26 October 2024",
//     postMediaType: "Live Action",
//     postProjectRole: "actor",
//     postStatus: "success",
//     postImages: "/path-to-image.jpg",
//   }));



export default function HistoryPostPage(){
  const [postHistoryResponse,setPostHistoryResponse]= useState<Project[]|null>(null)
  const id="679f4b5e6a883d2014e8360e"
  useEffect(()=>{
      const fetchData=async()=>{
          const response= await getHistoryPosts(id)
          console.log(response)
          setPostHistoryResponse(response.data)
      }
      fetchData()
  },[])
  
  console.log(postHistoryResponse)

  if(!postHistoryResponse){
    return <>Loading</>
  }

  console.log(postHistoryResponse)
  return (
    <div className="p-4">

      {/* Project History */}
      <h2 className="text-2xl font-bold text-center my-4">Post-History</h2>
      <PostHistoryList postLists={postHistoryResponse}/>
    
    </div>
  );
};

 
