// frontend/src/components/ReviewSubmissionForm.tsx

"use client";

import React, { SetStateAction, Dispatch, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import StarRating from "./StarRating";
import ReviewComment from "./ReviewComment";
import ReviewProfessionalList from "./ReviewProfessionalList";

const formSchema = z.object({
  comment: z
    .string({ required_error: "Please type in your comment" })
    .trim() //prevent case of PURELY whitespace
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

const mockProductionProfList = [
  { label: "Klein Swatee - Cameraman", value: "67b1a81ded193cb7b3dd94bb" },
  { label: "Maggeline Brent - Lighting", value: "67b1a81ded193cb7b3dd94b2" },
  { label: "Johny Stafrod - Prop Master", value: "67b1a81ded193ab7b3dd94bb" },
  { label: "Czesky Wolfenmacht - Director", value: "67b1a81d28193cb7b3dd94bb" },
  { label: "Ellen Joe - Stunt Specialist", value: "67b2a814ed195cbdb3de94ba" },
  { label: "Zhu Yuan - Stunt Specialist", value: "67b2a114e41952bdb3de94ba" },
  {
    label: "Donald Tim Johnson - Marketing",
    value: "67b2a814ed251cbdb3de94ba",
  },
  { label: "Kosuke Sato - Writer", value: "67b2a811ed291cbdb34294ba" },
];

interface ReviewSubmissionFormProps {
  role: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  toast: (msg: {
    variant: "default" | "destructive" | null | undefined;
    title: string;
    description: string;
  }) => void;
}

const ReviewSubmissionForm = ({
  role,
  isOpen,
  setIsOpen,
  onSubmit,
  toast,
}: ReviewSubmissionFormProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      rating: 0,
      production: role === "producer" ? undefined : "unneeded",
    },
  });

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) form.reset();
  }, [isOpen]);

  const commentValue = form.watch("comment");

  return (
    <div onClick={handleClick}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Review as a {role}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  {role === "producer" && (
                    <ReviewProfessionalList
                      form={form}
                      productionList={mockProductionProfList}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <ReviewComment form={form} />
                  <p className="text-sm text-gray-500">
                    {commentValue.replace(/^\s+/, "").length}/1000 characters
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Review</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewSubmissionForm;
