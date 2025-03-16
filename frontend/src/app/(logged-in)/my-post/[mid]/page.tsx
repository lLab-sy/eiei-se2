"use client"
import HistoryProductionContent from "@/components/HistoryProductionContent";
import MyPostDetail from "@/components/MyPostDetail";
import ProfessionalWorkingContent from "@/components/ProfessionalWorkingContent";
import { useParams } from "next/navigation";
import { PostData } from "../../../../../interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getPostById from "@/libs/getPostById";

// const mockMyPost :PostData= {
//     id:"67alk6884lop",
//     postName: "PNak Prakanong",
//     postDescription: "Thai Movie in 2010s",
//     postImages: ["1","2","3"], 
//     postMediaType: "Movie",
//     postProjectRolesOut:[{roleName:"Actor",id:"67xxxxx"}] ,
//     postStatus: "created",
//     startDate:"14-02-2568" ,
//     endDate: "14-03-2568", 
//     userID: "67xxxxxx",
//     postImageDisplay:[{imageKey:"4a5dfds",imageURL:"aws.picture.com"}],
//     participants: [
//         {
//             comment:"",
//             createdAt:"14-02-2568",
//             offer:[],
//             participantID:"xxxx", //เอา firstName ออกมา
//             ratingScore:0,
//             status:"candidate",
//             updatedAt:"14-02-2568",
//             reviewedAt:""
//             isSend=true,
//             workQuota=3,
//             isApprove=true
//         }
//     ]
// }



export default function MyPostContentPage(){
    const { mid }: { mid: string } = useParams();
    const { data: session } = useSession();
    const userRole=session?.user.role
    const userID=session?.user.id
    const token=session?.user.token
    const [post,setPost] = useState<PostData|null>(null)
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
          const fetchData = async () => {
            try {
              let response;
              if (userRole === "producer") {
                response = await getPostById(mid,session?.user.token??"") // ดึงโพสต์ของ producer 
              } else if (userRole === "production professional") {
     
              }
              console.log("respons",response)
              if (response) {
                setPost(response);
              }
            } catch (err) {
              setError("Failed to load posts. Please try again later.");
            }
        }
            fetchData();
        }, [userID, userRole]);
        
    return(
        <main className="min-h-screen bg-white-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 my-5 h-full flex-auto">
                <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                    <MyPostDetail post={post}/>
                </div>
                <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                    <ProfessionalWorkingContent/>
                </div>
            </div>
        </main>
    )
}