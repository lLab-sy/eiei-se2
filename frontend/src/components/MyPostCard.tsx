import { Calendar, Film, User } from "lucide-react";
import Image from "next/image";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PostData } from "../../interface";


const formSchema = z.object({
    comment: z
      .string({ required_error: "Please type in your comment" })
      .trim()
      .min(10, { message: "Comment must be at least 10 characters." })
      .max(1000, { message: "Comment must not exceed 1000 characters." }),
    rating: z
      .number({
        required_error: "Please provide a rating between 1 to 5 star(s).",
      })
      .min(1, { message: "Please provide a rating between 1 to 5 star(s)." })
      .max(5, { message: "Please provide a rating between 1 to 5 star(s)." })
      .finite(),
    production: z
      .string({ required_error: "Please select a Production Professional." })
      .or(z.literal("unneeded")),
  });

export default function MyPostCard({role,isReview,postDetail}:{role:string,isReview?:boolean,postDetail:PostData}){
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const displayDate = postDetail.endDate
    ? new Date(postDetail.endDate).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
    
    const date2: Date = new Date();
    const date1: Date = new Date(postDetail.endDate??"");
    const diffTime: number = date2.getTime() - date1.getTime();
    const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
     async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.comment.length < 10) {
          toast({
            variant: "destructive",
            title: "Comment too short",
            description: "Comment must have at least 10 characters.",
          });
          return;
        }
    
        if (values.rating < 1 || values.rating > 5) {
          toast({
            variant: "destructive",
            title: "Invalid Rating",
            description: "Please provide a rating from 1 to 5 stars.",
          });
          return;
        }
     }
     const imageURL =
      postDetail.postImages && postDetail.postImages.length > 0
        ? postDetail.postImages[0]
        : "image/logo.png";
    return(
        <div className=" bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] h-[144px] w-[400px] p-2">
            <div className="grid grid-cols-7 gap-2 w-[100%] h-full">
                <div className="col-span-4 rounded-lg overflow-hidden w-[100%] relative">
                    <Image
                        src={imageURL}
                        alt={postDetail.id}
                        fill
                        className="object-cover w-full h-full p-0.5"
                    />
                </div>
                <div className="col-span-3 content-center justify-center">
                    <h3 className="text-lg font-semibold text-mainblue">
                        {postDetail.postName}
                    </h3>
                    {role === "producer" ? (
                        <>
                        <div className=" text-gray-600 text-sm flex">
                            <Film className="w-4 h-4 mr-2 text-mainblue-light " />
                            <p className="flex">Type: {postDetail.postMediaTypeOut.mediaName}</p>
                        </div>
                        <div className="  text-gray-600 text-sm flex">
                            <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p>
                            {postDetail.postStatus === "in-progress"
                          ? "During Develop"
                          : postDetail.postStatus === "created"
                          ? "Wait"
                          : postDetail.postStatus === "waiting"
                          ? "Wait"
                          : postDetail.postStatus==="success"
                          ? `EndDate:  ${diffDays == 0 ? `Today` : `${diffDays} day ago`}`
                          : `-`}
                            </p>
                        </div>
                        </>
                    ) : (
                        <>

                        <div className="flex items-center text-gray-600 text-sm mb-1">
                            <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p className="flex">Type: {postDetail.postMediaTypeOut.mediaName}</p>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p>
                            {postDetail.postStatus === "in-progress"
                          ? "During Develop"
                          : postDetail.postStatus === "created"
                          ? "Wait"
                          : postDetail.postStatus === "waiting"
                          ? "Wait"
                          : postDetail.postStatus==="success"
                          ? `EndDate: ${displayDate}`
                          : `-`}
                            </p>
                        </div>
                        </>
                        )}
                </div>
                {isReview&&  (<div className="col-span-7 content-center justify-center">        
                <button
                    className="w-full px-3 py-2 text-sm bg-mainblue text-white rounded-md
                    hover:bg-mainblue-light transition-colors"
                    onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                    }}
                >
                {role === "producer" ? "Review Professional" : "Review Project"}
                </button>
                </div>
                )}
          
         </div>
    </div>
    )
}