import React, { useState, FormEvent } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewSubmissionFormProps {
  trigger?: React.ReactNode;
  onSubmit?: (data: { rating: number; comment: string }) => void;
  toast: (msg: {variant: "default" | "destructive" | null | undefined, title: string, description: string}) => void;
}

const ReviewSubmissionForm = ({
  trigger,
  onSubmit,
toast}: ReviewSubmissionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      //console.log("Rating === 0")
      toast({
        variant: "destructive",
        title: "No rating provided",
        description: "Please provide a rating between 1 to 5 star(s).",
        })
      return;
    }

    if (comment.length < 10) {
      //console.log("Short comment")
      toast({
        variant: "destructive",
        title: "Comment too short",
        description: "Comment must have at least 10 characters.",
        })
      return;
    }

    onSubmit?.({ rating, comment });
    setIsOpen(false);
    setRating(0);
    setComment("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Submit Review</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-mainyellow text-mainyellow"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this professional..."
                className="h-32"
              />
              <p className="text-sm text-gray-500">
                {comment.length}/1000 characters
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Review</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewSubmissionForm;
