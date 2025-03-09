"use client";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PostData } from "../../interface";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

export default function PostSelect({
  postData,
  postSelectData,
  changePostSelect,
  userRole,
}: {
  postData: PostData[];
  postSelectData: PostData;
  changePostSelect: Function;
  userRole: string;
}) {
  // Mock images array for demonstration
  const mockImages = ["/image/logo.png", "/image/logo.png", "/image/logo.png"];
  const handleSelectChange = (selectID: string) => {
    const selectedPost = postData.find((post) => post.id === selectID);
    if (selectedPost && selectedPost.id !== postSelectData?.id) {
      console.log("ChangPost");
      changePostSelect(selectedPost);
    }
  };
  console.log("IAMGE",postSelectData?.postImageDisplay)
  return (
    <div className="flex flex-col w-4/5 lg:w-3/5 m-auto space-y-4">
      <Carousel className="w-full">
        <CarouselContent>
          {postSelectData?.postImageDisplay.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="relative w-full aspect-video">
                <Image
                  src={image.imageURL}
                  alt={`Project Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {userRole === "producer" ? (
        <Select
          onValueChange={handleSelectChange}
          value={postSelectData?.id || ""}
        >
          <SelectTrigger className="shadow-lg">
            <SelectValue placeholder="Choose your Post" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {postData.map((eachPost: PostData) => (
                <SelectItem key={eachPost.id} value={eachPost.id}>
                  {eachPost.postName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <h2 className="text-xl font-semibold text-center mt-4">
          {postSelectData.postName}
        </h2>
      )}
    </div>
  );
}
