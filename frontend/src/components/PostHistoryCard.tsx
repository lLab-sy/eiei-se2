import Image from "next/image";
import { PostDataHistory, ReviewData } from "../../interface";
import { Clock, Calendar, User, Film } from "lucide-react";
import ReviewSubmissionForm from "@/components/ReviewSubmissionForm";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { z } from "zod";
import postReviewPost from "@/libs/postReviewPost";
import putReviewProfessional from "@/libs/putReviewProfessional";
import { useSession } from "next-auth/react";

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
  const [hasReviewed, setHasReviewed] = useState(false);
  const { data: session } = useSession();
  const token = session?.user?.token;
  const userId = session?.user?.id;

  const endDateDayJS = new Date(post.endDate);
  const EndDate = endDateDayJS.toDateString();

  const startDateDayJS = new Date(post.startDate);
  const StartDate = startDateDayJS.toDateString();

  useEffect(() => {
    if (role === "production professional" && post.participant) {
      if (!Array.isArray(post.participant)) {
        if (post.participant.participantID && post.participant.reviewedAt) {
          setHasReviewed(
            post.participant.participantID.toString() === userId &&
              post.participant.reviewedAt !== null,
          );
        }
      } else {
        const reviewed = post.participant.some(
          (p) =>
            p.participantID &&
            p.participantID.toString() === userId &&
            p.reviewedAt !== null,
        );
        setHasReviewed(reviewed);
      }
    }
  }, [post, userId, role]);

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
      postID: post.id,
      ratingScore: values.rating,
      comment: values.comment,
    };

    try {
      let response;

      if (role === "producer") {
        const professionalId = values.production;
        response = await putReviewProfessional(
          reviewData,
          token??'',
          professionalId,
        );
      } else {
        response = await postReviewPost(reviewData, token??"", post.id);
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

      setHasReviewed(true);
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

  return (
    <div className="group relative bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] h-full flex flex-col">
      <div className="flex p-4 flex-1">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-4">
          <Image
            src={
              post.postImages && post.postImages.length > 0
                ? `${post.postImages[0]}`
                : "/image/logo.png"
            }
            alt={post.postName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-mainblue mb-2 line-clamp-2">
            {post.postName}
          </h3>
          {role === "producer" ? (
            <>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                <p>Type: {post.postMediaType}</p>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <User className="w-4 h-4 mr-2 text-mainblue-light" />
                <p>Roles: {post.postProjectRoles?.join(", ") || "N/A"}</p>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                <p>
                  Period: {StartDate} - {EndDate}
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
      </div>
      {post.postStatus === "success" && !hasReviewed && (
        <div className="p-4 border-t">
          {role !== 'producer' && post.participant.reviewedAt == null && (
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
          )}
          {role === 'producer' && (
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
          )}
        </div>
      )}
      <ReviewSubmissionForm
        role={role}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmit}
        toast={toast}
        postId={post.id}
      />
    </div>
  );
}