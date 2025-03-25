import { ParticipantForRight, PostData } from "../../interface";
import ProfessionalWorkingCard from "./ProfessionalWorkingCard";
import TaskSubmissionCard from "./TaskSubmissionCard";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
import { Loader2, UploadCloud } from "lucide-react";
import getPostParticipantCandidate from "@/libs/getPostParticipantCandidate";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircularProgress, LinearProgress } from "@mui/material";
import postSendWork from "@/libs/postSendWork";
import { toast } from "@/hooks/use-toast";

export default function TaskSubmissionContent({isOpen,
    setIsOpen,postStatus
    }:{isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
      postStatus:string;
      }){

        const { mid }: { mid: string } = useParams();
        const { data: session } = useSession();
        const userRole=session?.user.role
        const userID=session?.user.id
        const username = session?.user.username ?? "";
        const token =session?.user.token;
        const [participantsRight, setParticipantsRight] = useState<ParticipantForRight | null>(null);
        const [refreshKey, setRefreshKey] = useState(0);
        const [error, setError] = useState<string | null>(null);
        
           useEffect(() => {
                 const fetchData = async () => {
                   try {
                     let response;
                     if (userRole === "production professional") {
                       response = await getPostParticipantCandidate(mid,session?.user.token??"") // ดึงโพสต์ของ producer 
                     } else if (userRole === "production professional") {
            
                     }
                     if (response) {
                       setParticipantsRight(response[0]);
                     }
                   } catch (err) {
                     setError("Failed to load posts. Please try again later.");
                   }
               }
                   fetchData();
               }, [userID, userRole,refreshKey]);
    // const [files, setFiles] = useState<File[] |null>(null);

    // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    //     event.preventDefault();
    //     const droppedFiles = Array.from(event.dataTransfer.files);
    //     setFiles(droppedFiles);
    //     console.log(droppedFiles)
    // };
    const refreshParticipants = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    async function sendWork () {
        const postCreateResponse = await postSendWork(mid,token??"")
        if (!postCreateResponse) {
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "Please try again.",
            })
            return
        }
 
            refreshParticipants()
            toast({
            variant: "default",
            title: "Successful approve work",
            description: `Mask post success.`,
        })
        setIsOpen(false)
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allows the drop event
    };
    return(
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%] relative">
            <div className="grid grid-cols-1 w-f"> {/*adjust height for children element */}
                <h1 className="text-start h-[30%] text-xl font-bold my-5 ml-10 p-0">Task Submission</h1>
                <div className="w-[90%] m-auto content-center">
                    <div className="w-full grid grid-cols-7 h-full bg-mainblue-darkest m-auto text-sm p-5 font-bold text-white text-center whitespace-normal break-words items-center content-center rounded-lg">
                        <div className="col-span-2">
                            <p className="">Task Status</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Work Quota</p>
                        </div>
                        <div className="col-span-3">
                            <p className="">Submission Time</p>
                        </div>
                    </div>
                    <div className="overflow-y-auto h-full max-h-[450px] m-auto bg-slate-400">
                    {participantsRight && participantsRight.submissions && (participantsRight.submissions?.length-1)>=0 ? (
                        participantsRight.submissions.map((eachData, index) => (
                            <TaskSubmissionCard 
                                key={index} 
                                isApprove={participantsRight.isApprove??false} 
                                isSend={participantsRight.isSend??false} 
                                workIter={index} 
                                workTime={eachData} 
                                latest={index==(participantsRight.submissions?.length-1)}
                            />
                        ))
                    ) : (
                        <div className="text-small text-center bg-white font-bold">
                            Our Working is going to start soon. 
                        </div>
                    )}
                    </div>
                    
                </div>
            </div>
            <div className="flex absolute justify-end bottom-2 right-5">
            {!participantsRight?.isSend && postStatus=="in-progress" && participantsRight?.workQuota && participantsRight?.workQuota>=0 ? <Button onClick={()=>setIsOpen(true)}>
                    Submit new task
                </Button> : ''}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Task Submission: {username}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-row flex">
                        {/* <UploadCloud className="w-10 h-10"/>
                        <div className="flex-col flex ml-2">
                            <p className="font-bold text-xl">Upload Files</p>
                            <p className = "">Select and upload the files of your choice</p>
                        </div> */}
                    </div>
                    <div className="justify-items-center bg-slate-200 rounded-sm border-dashed border-4 border-maingrey"
                    // onDrop={handleDrop}
                    // onDragOver={handleDragOver}
                    >
                        {/* <UploadCloud className="mb-5"/>
                        {files?.length === 0 ?
                            <p className="">Choose a file</p>
                        :
                            files?.map((file) => 
                            <p key={file.name}>{file.name}</p>
                        )
                        } */}
                    </div>
                    <DialogFooter className="gap-3 relative">
                        <Button className="bg-mainred hover:bg-mainred-light absolute left-0" onClick={(e)=>{setIsOpen(false)}}>
                            Cancel
                        </Button>
                        <Button className="bg-maingreen hover:bg-maingreen-light" onClick={sendWork}>
                            Confirm
                        </Button>
                    </DialogFooter>
                    
            </DialogContent>
      </Dialog>
        </main>
    )
}