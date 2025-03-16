import { Calendar, Film, User } from "lucide-react";
import Image from "next/image";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";


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

export default function MyPostCard({role,isReview}:{role:string,isReview?:boolean}){
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    
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
    return(
        <div className=" bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] h-[144px] w-[400px] p-2">
            <div className="grid grid-cols-7 gap-2 w-[100%] h-full">
                <div className="col-span-4 rounded-lg overflow-hidden w-[100%] relative">
                    <Image
                        src={"https://awsbucketeiei.s3.us-east-1.amazonaws.com/6be63d2640ac04279e08a2c36ea566a44465368e51a73d6af5ea15fb78378219?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA2QSBDQKPK4XOTYVC%2F20250315%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250315T161521Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD2NXp8Zp0EChtQLrDgTpIBOBQ6UVwj1XZcWrVOCyBeegIhAKTZ6vbBZujhbF7hyGOfsILW02if96zf%2FL%2FOqV7rK2%2FdKrgCCBkQABoMNzIyNzY0NzkyNDc4IgyE1t5iy3iwauCxsk4qlQIqgUON14ROEthQRE2%2F0315k8lga%2FruHc8O4YJZN864FG7XRR7bx4uhE%2By63J2lifr4wX3OYnrB5ZGo4uSjdCx9HJ1XpPjgy4KdGZ1RdnBrwNdLH1f7RDkdHiXgSL6b%2FZjG4fDQ%2FBwujWs%2B7kKhNkuLyLHVUUpYQQVmF2Js5YrgT71s9yyZpRzySMbsPoP2mPJ0WtoLwKyAnsjxqtV6jWEeOEr%2BJLh14KDbWLsOp6oWgMySx4QOCMgk%2B7tPARknoSPOkYk0Ww%2BwQmvlUZ8oSqEQub58kIzD0JxUvt8gfn2KyiBrCAlhLw1MYT8l5C2s%2B4K02pbOa1AxyFTCSOr%2BYTQsLlr5jDdGIAp9%2BYsv4eZwFR9E74AgMKvO1r4GOpwBsA4ujAr20f0Mv%2BZ9jRkHuZl501Y698i89Xn6aIDXSfY6ZWe97xEJ8lfnQrLU51DL3IK1NWio7ipkhA%2BXRcCijycafuFLmw%2BCuC7AXagKkj%2BoTIslFjz2G2Kfzfxig2mJyKZUGEWlUmNoEOBTSrqp%2BK5bFCmCA878oVZKGGSqpWVel%2BSJnXHzK89Im7FVrc4EktzmCBu7xs7mofnF&X-Amz-Signature=5adc7a88b254b14f697f4ed202dcc0b81d93ae5893cde2a1cf51b27c16a4551b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"}
                        alt="hello"
                        fill
                        className="object-cover w-full h-full p-0.5"
                    />
                </div>
                <div className="col-span-3 content-center justify-center">
                    <h3 className="text-lg font-semibold text-mainblue">
                        InterStaella
                    </h3>
                    {role === "producer" ? (
                        <>
                        <div className=" text-gray-600 text-sm flex">
                            <Film className="w-4 h-4 mr-2 text-mainblue-light " />
                            <p className="flex">Type: Movie</p>
                        </div>
                        <div className="  text-gray-600 text-sm flex">
                            <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p>
                            EndDate: 14-02-2568
                            </p>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                            <User className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p>Producer: {post.producerName?.producerName || "Unknown"}</p>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                            <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p>Role: {post.postProjectRolesOutProfessional?.roleName}</p>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                            <p>Completed: {EndDate}</p>
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