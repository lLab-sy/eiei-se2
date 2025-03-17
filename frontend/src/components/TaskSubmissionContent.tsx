import { PostData } from "../../interface";
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
import { UploadCloud } from "lucide-react";

export default function TaskSubmissionContent({isOpen,
    setIsOpen, username
    }:{isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
      username : string
      }){
    // useEffect(() => {
    //           const fetchData = async () => {
    //         //     try {
    //         //         // const response = await // ดึงโพสต์ของ Production Professional?
    //         //         // console.log("respons",response)
    //         //     //   if (response) {
    //         //     //     setPost(response);
    //         //     //   }
    //         //     // } catch (err) {
    //         //     //   setError("Failed to load posts. Please try again later.");
    //         //     // }
    //         }
    //             fetchData();
    //         }, []);
    const [post,setPost] = useState<PostData|null>(null)
    const [files, setFiles] = useState<File[] |null>(null);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(droppedFiles);
        console.log(droppedFiles)
    };

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
                        <TaskSubmissionCard/>
                        <TaskSubmissionCard/>
                        <TaskSubmissionCard/>
                        <TaskSubmissionCard/>
                    </div>
                    
                </div>
            </div>
            <div className="flex absolute justify-end bottom-2 right-5">
                <Button onClick={()=>setIsOpen(true)}>
                    Submit new task
                </Button>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Task Submission: {username}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-row flex">
                        <UploadCloud className="w-10 h-10"/>
                        <div className="flex-col flex ml-2">
                            <p className="font-bold text-xl">Upload Files</p>
                            <p className = "">Select and upload the files of your choice</p>
                        </div>
                    </div>
                    <div className="justify-items-center bg-slate-200 rounded-sm border-dashed border-4 border-maingrey"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}>
                        <UploadCloud className="mb-5"/>
                        {files?.length === 0 ?
                            <p className="">Choose a file</p>
                        :
                            files?.map((file) => 
                            <p key={file.name}>{file.name}</p>
                        )
                        }
                    </div>
                    <DialogFooter className="gap-3 relative">
                        <Button className="bg-mainred hover:bg-mainred-light absolute left-0">
                            Cancel
                        </Button>
                        <Button className="bg-maingreen hover:bg-maingreen-light">
                            Confirm
                        </Button>
                    </DialogFooter>
                    
            </DialogContent>
      </Dialog>
        </main>
    )
}