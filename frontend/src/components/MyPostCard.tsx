import { Calendar, Film } from "lucide-react";
import Image from "next/image";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Participant, PostData, ReviewData } from "../../interface";
import { useSession } from "next-auth/react";
import getPostParticipants from "@/libs/getPostParticipants";
import putReviewProfessional from "@/libs/putReviewProfessional";
import postReviewPost from "@/libs/postReviewPost";
import getPostById from "@/libs/getPostById";


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

export default function MyPostCard({role,postDetail}:{role:string,postDetail:PostData}){
    const {data : session} = useSession();
    const token = session?.user.token??"";
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isReviewed, setIsReviewed] = useState(true);
    const userId = session?.user.id??"";

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
      const reviewData: ReviewData = {
            createdAt: new Date(),
            postID: postDetail.id!,
            ratingScore: values.rating,
            comment: values.comment,
          };
      
          try {
            let response;
      
            if (role === "producer") {
              const professionalId = values.production;
              response = await putReviewProfessional(
                reviewData,
                token,
                professionalId,
              );
            } else {
              response = await postReviewPost(reviewData, token, postDetail.id!);
            }
      
            if (!response) {
              toast({
                variant: "destructive",
                title: "Failed to submit review",
                description: "Failed to submit review. Please try again.",
              });
              return;
            }
      
            if (response.data?.status === "error") {
              toast({
                variant: "destructive",
                title: "Review Submission Failed",
                description: response.data?.message || "Failed to submit review",
              });
              return;
            }
      
            toast({
              variant: "default",
              title: "Successful review submission",
              description: "Your review has been submitted!",
            });
            setIsReviewed(true);
            setIsOpen(false);
          } catch (error) {
            console.error("Error submitting review:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "An unexpected error occurred. Please try again.",
            });
          }
     }
    const imageURL = postDetail.postImages && postDetail.postImages.length > 0 ? 
    postDetail.postImages[0] : "image/logo.png";
    
    useEffect(() => {
      const test = async () => {
        if (postDetail.postStatus === "success") {
          if (role === "producer"){
            const response = await getPostParticipants(postDetail.id??"", token)
            const validParticipants = response.data
                .filter((item) => !item.isReview)
            console.log(validParticipants.length)
            setIsReviewed(validParticipants.length <= 0)
          } else if (role === "production professional") {
            const response = await getPostById(postDetail.id??"", token)
            const selfParticipant = response.participants.filter((item: Participant)=> item.participantID === userId)[0]
            setIsReviewed(selfParticipant.reviewedAt !== null)
          }
        }
      }
      test()
    }, [isReviewed]);

    
    return(
        <div className=" bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] min-h-[144px] max-h-[200px] w-[400px] p-2">
            <div className="grid grid-cols-8 gap-3 w-[100%] h-full">
                <div className="col-span-4 rounded-lg overflow-hidden w-[100%] relative">
                    <Image
                        src={imageURL}
                        alt={postDetail.id??"postImage"}
                        fill
                        className="object-cover w-full h-full p-0.5"
                    />
                </div>
                <div className="col-span-4 content-center justify-center">
                  <h3 className="text-lg font-semibold text-mainblue">
                      {postDetail.postName}
                  </h3>
                  <>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <Film className="w-4 h-4 mr-2 text-mainblue-light " />
                      <p className="flex">Type: {postDetail.postMediaTypeOut.mediaName}</p>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                      <p>
                        {postDetail.postStatus === "in-progress"
                          ? "During Development"
                          : postDetail.postStatus === "created"
                          ? "New Post"
                          : postDetail.postStatus === "waiting"
                          ? "Waiting"
                          : postDetail.postStatus === "success"
                          ? `End Date:  ${diffDays == 0 ? `Today` : `${diffDays} days ago`}`
                          : `-`
                        }
                      </p>
                    </div>
                  </>
                </div>
                {!isReviewed && postDetail.postStatus === "success" && (
                <div className="col-span-8 content-center justify-center">
                    <div className="pt-4 border-t">        
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
                    <ReviewSubmissionForm
                            role={role}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            onSubmit={onSubmit}
                            toast={toast}
                            postId={postDetail.id!}
                          />
                </div>
                
                )}
            </div>
        </div>
    )
}