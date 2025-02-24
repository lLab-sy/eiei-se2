import Image from "next/image";
import { PostDataHistory, ReviewData } from "../../interface";
import { Clock, Calendar, User, Film } from "lucide-react";
import ReviewSubmissionForm from "@/components/ReviewSubmissionForm";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import axios from "axios";

export default function PostHistoryCard({
  post,
  userName,
  role,
}: {
  post: PostDataHistory;
  userName: string;
  role: string;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const endDateDayJS = new Date(post.endDate);
  const EndDate = endDateDayJS.toDateString();

  const startDateDayJS = new Date(post.startDate);
  const StartDate = startDateDayJS.toDateString();

  const formSchema = z.object({
    comment: z
      .string({required_error: "Please type in your comment"})
      .trim() //prevent case of PURELY whitespace
      .min(10, { message: "Comment must be at least 10 characters." })
      .max(1000, { message: "Comment must not exceed 1000 characters." }),
    rating: z
      .number({required_error: "Please provide a rating between 1 to 5 star(s)."})
      .min(1, { message: "Please provide a rating between 1 to 5 star(s)."})
      .max(5, { message: "Please provide a rating between 1 to 5 star(s)."})
      .finite(),
    production: z
      .string({required_error: "Please select a Production Professional."})
      .or(z.literal('unneeded')),
  });

  // Handle review submission - fixed logic issue
  async function onSubmit (values: z.infer<typeof formSchema>) {
      //console.log("Submit called")
      console.log(values)
      if (values.comment.length < 10) {
        toast({
          variant: "destructive",
          title: "Comment too short",
          description: "Comment must have at least 10 characters.",
          })
        return;
      }
      if (values.rating < 1 || values.rating > 5) {
        toast({
          variant: "destructive",
          title: "Invalid Rating",
          description: "Please provide a rating from 1 to 5 stars.",
          })
        return;
      }
        const reviewData:ReviewData = {
          createdAt: new Date(),
          postID: post.id,
          ratingScore: values.rating,
          comment: values.comment
        }
        // In real app, make API call to submit review
        // idk route for prodprof -> producer  
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${role === "producer" ? `/users/${values.production}/addReview`:"" }` 
        const response = await axios.put(
          apiUrl, reviewData,
{
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if(!response) {
          console.log("Post Review Res", response)
          toast({
            variant: "destructive",
            title: "Failed to submit review",
            description: "Failed to submit review. Please try again.",
          });
          return
        }
        if (response.data.data.status == "error") {
          toast({
            variant: "destructive",
            title: "Edit Profile",
            description: response.data.data ?? "Failed to Edit User",
          });
          return;
        }
          // Fixed condition - show success message when response is OK
          toast({
            variant: "default",
            title: "Successful review submission",
            description: "Your review has been submitted!",
          });
          setIsOpen(false)
      }
    


  return (
    <div className="group relative bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden">
      {/* <div className="absolute inset-0 bg-mainblue opacity-0 group-hover:opacity-10 transition-opacity duration-300" /> */}
      <div className="flex p-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={
              post.postImages && post.postImages.length > 0
                ? `/${post.postImages[0]}`
                : "/image/logo.png"
            }
            alt={post.postName}
            width={parent.innerWidth}
            height={parent.innerHeight}
            className="object-cover w-[40%] h-[50%] rounded-lg"
          />
        </div>
        <div className="ml-6 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-mainblue mb-2 group-hover:text-mainblue-light transition-colors">
              {post.postName}
            </h3>
          </div>
          {role === "producer" ? (
            // Producer View
            <>
              <div className="flex items-center text-gray-600">
                <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                <p className="text-sm">Type: {post.postMediaType}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2 text-mainblue-light" />
                <p className="text-sm">
                  Roles: {post.postProjectRoles.join(", ")}
                </p>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                <p className="text-sm">
                  Period: {StartDate} - {EndDate}
                </p>
              </div>
              {post.postStatus === "success" && (
            <div className="flex justify-end z-50">
              <button className="px-3 py-1 text-sm bg-mainblue text-white rounded-md
                     hover:bg-mainblue-light transition-colors" onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        console.log(setIsOpen)
                        console.log(isOpen)
                        setIsOpen(true)
                        }}>
                      Review Professional
                    </button>
            </div>
            )}
            </>
          ) : (
            // Production Professional View
            <>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2 text-mainblue-light" />
                {/* <p className="text-sm">Producer: {post.}</p> */}
              </div>
              <div className="flex items-center text-gray-600">
                <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                <p className="text-sm">
                  Role:{" "}
                  {Array.isArray(post.postProjectRoles)
                    ? post.postProjectRoles.join(", ")
                    : post.postProjectRoles}
                </p>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                <p className="text-sm">Completed: {EndDate}</p>
              </div>
              {post.postStatus === "success" && (
              <div className="flex justify-end z-50">
                <button className="px-3 py-1 text-sm bg-mainblue text-white rounded-md
                     hover:bg-mainblue-light transition-colors" onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(true)}}>
                        Review Project
                    </button>
              </div>
              )}
            </>
          )}
        </div>
      </div>
      <ReviewSubmissionForm
                role = {role}
                isOpen = {isOpen}
                setIsOpen={setIsOpen}
                onSubmit={onSubmit}
                toast={toast}
              />
    </div>
  );
}
