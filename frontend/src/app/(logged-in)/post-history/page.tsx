'use client'
import PostHistoryList from "@/components/PostHistoryList";
import { PostDataHistory} from "../../../../interface";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import getHistoryPost from "@/libs/getHistoryPosts";
import getHistoryPosts from "@/libs/getHistoryPosts";
import session from "redux-persist/lib/storage/session";
import { useSession } from "next-auth/react";


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
  const [postHistoryResponse,setPostHistoryResponse]= useState<PostDataHistory[]|null>(null)
  const {data:session} = useSession()
  
  if(!session){
    return <>Loading</>
  }

  const token=session.user?.token
  const userName=session.user?.username
  const role= session.user.role

  useEffect(()=>{
      const fetchData=async()=>{
          const response= await getHistoryPosts(token)
          setPostHistoryResponse(response.data.data)
      }
      fetchData()
  },[])
  
 

  if(!postHistoryResponse){
    return <>Loading</>
  }

  console.log(postHistoryResponse)
  return (
    <div className="p-4">

      {/* Project History */}
      {/* <h2 className="text-2xl font-bold text-center my-4">Post-History</h2> */}
      <PostHistoryList postLists={postHistoryResponse} userName={userName} role={role}/>
    
    </div>
  );
};

 
