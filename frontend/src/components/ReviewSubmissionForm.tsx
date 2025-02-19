import React, { useState, FormEvent } from "react";
import { Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ReviewSubmissionForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (comment.length < 10) {
      alert("Please provide a more detailed review (minimum 10 characters)");
      return;
    }

    // In a real application, this would make an API call to submit the review
    console.log("Submitting review:", { rating, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Review Submitted Successfully!
            </h3>
            <p className="text-gray-600">
              Thank you for providing your feedback.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Submit Review</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setRating(0);
              setComment("");
            }}
          >
            Clear
          </Button>
          <Button type="submit">Submit Review</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewSubmissionForm;
