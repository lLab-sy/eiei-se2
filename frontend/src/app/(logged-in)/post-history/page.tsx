'use client'
import PostHistoryList from "@/components/PostHistoryList";
import { PostDataHistory} from "../../../../interface";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import getHistoryPost from "@/libs/getHistoryPosts";
import getHistoryPosts from "@/libs/getHistoryPosts";
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
  const [token, setToken]  = useState<string>('')
  const [userName, setUserName] = useState<string>('') 
  const [role, setRole]  = useState<string>('')
  const {data:session,status} = useSession()
  
  useEffect(()=>{
    if (!session) return;
    setToken(session.user.token)
    setRole(session.user.role)
    setUserName(session.user.username)
  },[status])

  useEffect(()=>{
      if (!token) return ;

      const fetchData=async()=>{
          const response= await getHistoryPosts(token)
          setPostHistoryResponse(response.data.data)
      }
      fetchData()
  },[]) 
  console.log("Token", token)
 

  if(status === "loading"){
    return <>Loading</>
  } 

  console.log(postHistoryResponse)
  return (
    <div className="pt-10 min-h">

      {/* Project History */}
      {/* <h2 className="text-2xl font-bold text-center my-4">Post-History</h2> */}
      <PostHistoryList postLists={postHistoryResponse} userName={userName} role={role}/>
    
    </div>
  );
};

 
