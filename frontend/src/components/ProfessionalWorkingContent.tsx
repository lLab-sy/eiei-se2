import ProfessionalWorkingCard from "./ProfessionalWorkingCard";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "./ui/button";
import { PostData } from "../../interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getPostById from "@/libs/getPostById";
import { LinearProgress } from "@mui/material";
import Link from "next/link";
export default function ProfessionalWorkingContent({pid}:{pid:string}){
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
                    response = await getPostById(pid,session?.user.token??"") // ดึงโพสต์ของ producer 
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
    if(!post){
        return <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%] relative"> 
        <h1 className="text-center text-xl font-bold my-5 ml-10 p-0">Loading Professional Logs</h1> 
        <LinearProgress />
        </main>
    }
    return(
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%] relative">
            <div className="grid grid-cols-1  w-full">
                <h1 className="text-start text-xl font-bold my-5 ml-10 p-0">Production Professional</h1>
                <div className="w-[90%] m-auto content-center">
                    <div className="w-full grid grid-cols-11 h-full bg-mainblue-darkest m-auto text-sm p-5 font-bold text-white text-center whitespace-normal break-words items-center content-center rounded-lg">
                        <div className="col-span-2">
                            <p className="">Name</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Role</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Status</p>
                        </div>
                        <div className="col-span-3">
                            <p className="">Confirmation</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Work Quota</p>
                        </div>
                    </div>
                    <div className="overflow-y-auto h-full max-h-[400px] m-auto bg-slate-100">
                        <ProfessionalWorkingCard  postStatus={post.postStatus}/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                    </div>
                    
                </div>
            </div>
            {/*ยังไม่มี waiting ให้ใช้ */}

            {post.postStatus === "created" && (
                <Link href={`/edit-post/${pid}`}>
                    <Button className="absolute bg-maingreen-light text-white p-3 rounded-md hover:bg-sky-700 shadow-lg right-5 bottom-5">
                            Edit Post
                    </Button>
               </Link>
            )}


            {post.postStatus === "waiting" && (
                <AlertDialog>
                    <AlertDialogTrigger className="absolute bg-maingreen-light text-white p-3 rounded-md hover:bg-sky-700 shadow-lg right-5 bottom-5">
                        Start Project
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Start the project</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                            <div className="flex flex-col gap-2">
                                <p className="text-black">You are about to start the project 
                                'Short Film: The Lost Memory'. This action will initiate the production phase. Do you want to proceed?</p>
                                <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">
                                Warning: Some required roles for this project are still unfilled. The following positions. 
                                </div>
                            </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-maingreen" asChild>
                                <Button>Confirm</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {post.postStatus === "in-progress" && (
                <AlertDialog>
                    <AlertDialogTrigger className="absolute bg-maingreen-light text-white p-3 rounded-md hover:bg-sky-700 shadow-lg right-5 bottom-5">
                        Mark as Complete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Mark Project as Completed</AlertDialogTitle>
                            <AlertDialogDescription className="text-black">
                                You are about to mark the post "Short Film The Lost Memory" as complete. This action confirms that the project is finished and both parties have agreed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-green-700" asChild>
                                <Button>Confirm</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </main>
    )
}