import Image from "next/image";
import { PostDataHistory } from "../../interface";
import { Clock, Calendar, User, Film } from "lucide-react";
import ReviewSubmissionForm from "@/components/ReviewSubmissionForm";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

  // Handle review submission - fixed logic issue
  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
  }) => {
    try {
      // In real app, make API call to submit review
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          // professionalId needs to be passed from elsewhere or hardcoded
          professionalId: "", // This needs to be provided from props or parent component
          ...data,
        }),
      });

      if (response.ok) {
        // Fixed condition - show success message when response is OK
        toast({
          variant: "default",
          title: "Successful review submission",
          description: "Your review has been submitted!",
        });
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: "Failed to submit review. Please try again.",
      });
    }
  };

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
            width={0}
            height={0}
            fill
            className="object-cover"
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
                      setIsOpen(true)}}>
                      {role === "producer" ? "Review Professional" : "Review Project"}
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
            </>
          )}
        </div>
      </div>
      <ReviewSubmissionForm
                isOpen = {isOpen}
                setIsOpen={setIsOpen}
                onSubmit={handleSubmitReview}
                toast={toast}
              />
    </div>
  );
}
