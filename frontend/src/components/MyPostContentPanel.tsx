"use client"
import HistoryProductionContent from "@/components/HistoryProductionContent";
import MyPostDetail from "@/components/MyPostDetail";
import ProfessionalWorkingContent from "@/components/ProfessionalWorkingContent";
import { useParams } from "next/navigation";
import { PostData } from "../../interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getPostById from "@/libs/getPostById";
import { LinearProgress } from "@mui/material";
import TaskSubmissionContent from "./TaskSubmissionContent";
export default function MyPostContentDetail(){
        const { mid }: { mid: string } = useParams();
        const { data: session } = useSession();
        const userRole=session?.user.role
        const userID=session?.user.id
        const username = session?.user.username ?? "";
        const [isOpen, setIsOpen] = useState(false);
        const [post,setPost] = useState<PostData|null>(null)
        const [error, setError] = useState<string | null>(null);
        const [refreshKey, setRefreshKey] = useState(0);
        useEffect(() => {
              const fetchData = async () => {
                try {
                  let response;
                  if (userRole === "producer") {
                    response = await getPostById(mid,session?.user.token??"") // ดึงโพสต์ของ producer 
                  } else if (userRole === "production professional") {
                    response = await getPostById(mid,session?.user.token??"")
                  }
                  // console.log("respons",response)
                  if (response) {
                    setPost(response);
                  }
                } catch (err) {
                  setError("Failed to load posts. Please try again later.");
                }
            }
                fetchData();
            }, [userID, userRole,refreshKey]);

    const refreshPost = () => {
      setRefreshKey((prevKey) => prevKey + 1);
    };
    
    return(
        <>
         <div className="grid grid-cols-1 lg:grid-cols-2 my-5 h-full flex-auto">
            <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                {post?<MyPostDetail post={post}/>:<LinearProgress/>}
        </div>
            <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
            { userRole == "production professional" ? 
                <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                    {post?<TaskSubmissionContent
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    postStatus={post.postStatus}
                    />:<LinearProgress/>}
                </div>
                :
                <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                    {post?<ProfessionalWorkingContent postStatus={post.postStatus} refreshPost={refreshPost}/>:<LinearProgress/>}
                    <ProfessionalWorkingContent setPostDetail={setPost} pid={mid}/>
                </div>
                }
            </div>
        </div>
        </>
    )
}

