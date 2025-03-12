"use client";

import React, { SetStateAction, Dispatch, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import StarRating from "./StarRating";
import ReviewComment from "./ReviewComment";
import ReviewProfessionalList from "./ReviewProfessionalList";
import getPostParticipants from "@/libs/getPostParticipants";
import { PostParticipant } from "../../interface";
import { useSession } from "next-auth/react";

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

// Fallback mock data
const mockProductionProfList = [
  { label: "Klein Swatee - Cameraman", value: "67b1a81ded193cb7b3dd94bb" },
  { label: "Maggeline Brent - Lighting", value: "67b1a81ded193cb7b3dd94b2" },
  { label: "Johny Stafrod - Prop Master", value: "67b1a81ded193ab7b3dd94bb" },
  { label: "Czesky Wolfenmacht - Director", value: "67b1a81d28193cb7b3dd94bb" },
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
  postId?: string;
}

const ReviewSubmissionForm = ({
  role,
  isOpen,
  setIsOpen,
  onSubmit,
  toast,
  postId,
}: ReviewSubmissionFormProps) => {
  const [participants, setParticipants] = useState<PostParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const token = session?.user?.token;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      rating: 0,
      production: role === "producer" ? "" : "unneeded",
    },
  });

  // ฟังก์ชันเพื่อป้องกันการปิด Dialog เมื่อคลิกภายใน
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // ดึงข้อมูล participants เมื่อ Dialog เปิด
  useEffect(() => {
    if (isOpen && role === "producer" && postId && token) {
      setLoading(true);

      getPostParticipants(postId, token)
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            console.log("API response data:", response.data);

            // ตรวจสอบว่าข้อมูลมีรูปแบบที่ถูกต้องหรือไม่
            const validParticipants = response.data
              .filter((item) => !item.isReview) // กรองเฉพาะคนที่ยังไม่ได้ถูกรีวิว
              .map((item) => {
                if (!item.value && item.id) {
                  return { ...item, value: item.id };
                }
                return item;
              })
              .filter((item) => item.label && item.value);

            console.log("Filtered participants:", validParticipants);
            setParticipants(validParticipants);

            // ตั้งค่าเริ่มต้นทันทีหลังได้ข้อมูล
            if (validParticipants.length > 0) {
              console.log("Setting default value:", validParticipants[0].value);
              // ใช้ setTimeout เพื่อให้แน่ใจว่าการอัพเดทค่าเกิดหลังจาก render รอบแรก
              setTimeout(() => {
                form.setValue("production", validParticipants[0].value, {
                  shouldValidate: true,
                });
                form.trigger("production"); // ทริกเกอร์การตรวจสอบฟอร์ม
              }, 0);
            }
          } else {
            console.error("Unexpected API response format:", response);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load production professionals.",
            });
            // ใช้ mock data เป็น fallback
            setParticipants(mockProductionProfList);
            form.setValue("production", mockProductionProfList[0].value, {
              shouldValidate: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load production professionals.",
          });
          // ใช้ mock data เป็น fallback
          setParticipants(mockProductionProfList);
          form.setValue("production", mockProductionProfList[0].value, {
            shouldValidate: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, postId, role, token, form, toast]);

  const commentValue = form.watch("comment");

  return (
    <div onClick={handleDialogClick}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Review as a {role}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6 py-4">
                {role === "producer" && (
                  <div className="space-y-2">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <span className="loading loading-spinner mr-2"></span>
                        <span>Loading professionals...</span>
                      </div>
                    ) : participants.length > 0 ? (
                      <ReviewProfessionalList
                        form={form}
                        productionList={participants}
                      />
                    ) : (
                      <div className="p-4 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                          ไม่พบผู้ร่วมงานที่ยังไม่ได้รับการรีวิว
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          คุณได้รีวิวผู้ร่วมงานทุกคนในโพสต์นี้แล้ว
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                    {commentValue?.replace(/^\s+/, "").length || 0}/1000
                    characters
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
                <Button
                  type="submit"
                  onClick={(e) => {
                    // เพิ่ม log เพื่อ debug
                    const values = form.getValues();
                    console.log("Submit with values:", values);
                    console.log("Form state:", form.formState);

                    if (!values.production && role === "producer") {
                      e.preventDefault();
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please select a production professional.",
                      });
                      return;
                    }

                    if (values.rating < 1) {
                      e.preventDefault();
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please provide a rating.",
                      });
                      return;
                    }
                  }}
                  disabled={loading}
                >
                  Submit Review
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewSubmissionForm;
