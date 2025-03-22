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
import { ApproveData, Participant, ParticipantForRight, PostData } from "../../interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getPostById from "@/libs/getPostById";
import { LinearProgress } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import getPostParticipantCandidate from "@/libs/getPostParticipantCandidate";
import putApproveWork from "@/libs/putApproveWork";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
// const StartProjectButton = ({ post, setPost, userRole }: { userRole: string, post: PostData, setPost:Function }) => {
//     const { data: session } = useSession();
//     const token = session?.user.token;
//     console.log("postDataDialog", post);
//     const handleStartProject = async (token: string) => {
//       const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${post.id}/startProject`;
//       setIsLoading(true);
//       await axios.put(
//         apiUrl,
//         {},
//         { withCredentials: true, headers: { Authorization: `Bearer ${token}` } },
//       );
//       const fetchData = async () => {
//           let response;
//           if (userRole === "producer") {
//             response = await getPostById(post.id, session?.user.token ?? ""); // ดึงโพสต์ของ producer
//           } else if (userRole === "production professional") {
//             response = await getPostById(post.id, session?.user.token ?? "");
//           }
//           console.log("respons", response);
//           if (response) {
//             setPost(response);
//           }
         
//       };
//       await fetchData();
//       setIsLoading(false);
//       setOpen(false);
//     };
//     const [open, setOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             className={`h-[40px] mt-[20px] w-[40%] text-lg self-end ${post?.postStatus === "in-progress" ? "bg-green-500" : ""}`}
//           >
//             {post?.postStatus === "created"
//               ? "Start a project"
//               : post?.postStatus === "in-progress"
//                 ? "Mark as completed"
//                 : ""}
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="">
//           <DialogHeader className="">
//             <DialogTitle className="">Confirm Start the project</DialogTitle>
//           </DialogHeader>
//           {isLoading ? (
//             <CircularProgress />
//           ) : (
//             <div>
//               <span>
//                 Your are about to start the project '{post?.postName ?? ""}'. This
//                 action will initiate the production phase. Do you want to proceed?
//               </span>
//               <div className="flex justify-center mt-5">
//                 <div className="w-[75%] h-[90px] flex bg-mainyellow-light text-mainred justify-center items-center rounded-lg">
//                   <span className="w-[90%] h-[85%]">
//                     Warning: Some required roles for this project are still
//                     unfilled. The following positions.
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
  
//           <div className="w-full flex justify-around mt-5">
//             <Button
//               disabled={isLoading}
//               onClick={() => setOpen(false)}
//               variant={"destructive"}
//               className="w-[25%] h-[80%] rounded-lg"
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isLoading}
//               onClick={() => handleStartProject(token ?? "")}
//               className="hover:bg-green-500 w-[35%] h-[80%] rounded-lg text-white bg-green-600"
//             >
//               Confirm
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   };
export default function ProfessionalWorkingContent({postStatus, refreshPost}:{postStatus:string, refreshPost: Function}){
        const { mid }: { mid: string } = useParams();
        const { data: session } = useSession();
        const userRole=session?.user.role
        const userID=session?.user.id
        const username = session?.user.username ?? "";
        const token =session?.user.token;
        const [isOpen, setIsOpen] = useState(false);
        const [participantsRight, setParticipantsRight] = useState<ParticipantForRight[] | null>(null);
        const [refreshKey, setRefreshKey] = useState(0);
        const [error, setError] = useState<string | null>(null);
        const [isloading, setIsLoading] = useState(false)
        const [noFinishCandidate,setNoFinishCandidate]=useState<string[]>([])


        const handleStartProject = async (token: string) => {
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${mid}/startProject`;
            setIsLoading(true);
            const res = await axios.put(
              apiUrl,
              {},
              { withCredentials: true, headers: { Authorization: `Bearer ${token}` } },
            );
            console.log('resStartProject', res)
            setIsLoading(false);

            if (!res) {
                toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: "Please try again.",
                })
                return
            }
                toast({
                variant: "default",
                title: "Successful approve work",
                description: `Mask post success.`,
            })
            refreshPost()
          };

        useEffect(() => {
              const fetchData = async () => {
                try {
                  let response;
                  if (userRole === "producer") {
                    response = await getPostParticipantCandidate(mid,session?.user.token??"") // ดึงโพสต์ของ producer 
                  } else if (userRole === "production professional") {
         
                  }
                  if (response) {
                    setParticipantsRight(response);

                    let particpantNoFinish:string[]=[];
                    response?.forEach((eachParticipant)=>{
                        // console.log("part",eachParticipant.participantIDs)
                        if(!eachParticipant.isSend && eachParticipant.workQuota && eachParticipant.workQuota>0){
                            particpantNoFinish.push(eachParticipant.participantID?.firstname?eachParticipant.participantID?.firstname:eachParticipant.participantID?.username)
                        }
                    })
                    setNoFinishCandidate(particpantNoFinish)
                  }
                } catch (err) {
                  setError("Failed to load posts. Please try again later.");
                }
            }
                fetchData();
            }, [userID, userRole,refreshKey]);

        const refreshParticipants = () => {
                setRefreshKey((prevKey) => prevKey + 1);
            };

        async function sendConfirm (approve:boolean) {
            const approveData:ApproveData = {
            isApprove:true,
            userId:""
            };
            const postCreateResponse = await putApproveWork(mid,approveData,token??"")
            if (!postCreateResponse || postCreateResponse != "success") {
                toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: "Please try again.",
                })
                return
            }
            refreshPost()
            refreshParticipants()
                toast({
                variant: "default",
                title: "Successful approve work",
                description: `Mask post success.`,
            })
            
        }
    if(!participantsRight){
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
                    <div className="overflow-y-auto h-full max-h-[400px] m-auto bg-slate-100" data-testid="Professional-working-cards">
                    {participantsRight ? (
                        participantsRight.map((eachCard: ParticipantForRight) => (
                            <ProfessionalWorkingCard key={eachCard.participantID._id} postStatus={postStatus} participantDetail={eachCard} setRefreshKey={refreshParticipants}/>
                        ))
                    ) : (
                        <LinearProgress/>
                    )}

                    </div>
                    
                </div>
            </div>
            {/*ยังไม่มี waiting ให้ใช้ */}

            {postStatus === "created" && userRole=="producer" && (
                <Link href={`/edit-post/${mid}`}>
                    <Button className="absolute bg-maingreen-light text-white p-3 rounded-md hover:bg-sky-700 shadow-lg right-5 bottom-5" data-test-id="edit-mypost-button">
                            Edit Post
                    </Button>
               </Link>
            )}


            {postStatus === "waiting" && (
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
                                This action will initiate the production phase. Do you want to proceed?</p>
                                <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">
                                Warning: Some required roles for this project are still unfilled. The following positions. 
                                </div>
                            </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-maingreen" asChild>
                                <Button onClick={() => handleStartProject(token ?? "")}>Confirm</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {postStatus === "in-progress" && (
                <AlertDialog>
                    <AlertDialogTrigger className="absolute bg-maingreen-light text-white p-3 rounded-md hover:bg-sky-700 shadow-lg right-5 bottom-5">
                        Mark as Complete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Mark Project as Completed</AlertDialogTitle>
                            <AlertDialogDescription className="text-black" asChild> 
                            <div className="flex flex-col gap-2">
                                <p className="text-black"> 
                                    You are about to mark the post as complete. This action confirms that the project is finished and both parties have agreed.
                                </p>
                                {
                                    noFinishCandidate?.length>0 ?
                                        <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">
                                        {`Beware there are ${noFinishCandidate?.join(',')} that may be not finished their work and they will get nothing`}
                                        </div>:<></>
                                }
                            </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-green-700" asChild>
                                <Button onClick={(e)=>{sendConfirm(true)}}>Confirm</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </main>
    )
}