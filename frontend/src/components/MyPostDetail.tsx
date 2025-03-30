import { Card } from "@mui/material";
import { PostData } from "../../interface";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Separator } from "./ui/separator";
import getPostById from "@/libs/getPostById";
import { auth } from "@/auth";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function MyPostDetail({post}:{post:PostData}) {
  if(!post){
    return(
        <div className="w-[80%] h-[100%] rounded-3xl shadow-lg m-auto content-center">
             <p className="text-center font-bold">You have no post detail.</p>
        </div>
    )
  }
  return (
    <div className="w-[80%] h-[100%] rounded-3xl shadow-lg m-auto flex">
      <div className="p-5 grid grid-cols-2  bg-white w-full rounded-lg">
        
        <div className="col-span-1 h-[20%]">
            <p className="text-md w-full m-auto font-bold col-span-1 h-[20%]">{post.postName}</p>
        </div>

        <p data-test-id="post-status"
            className={`text-sm w-full m-auto text-end font-semibold ${
                post.postStatus === "created" ? "text-mainblue-light" : 
                post.postStatus === "waiting" ? "text-mainblue-dark" : 
                post.postStatus === "in-progress" ? "text-mainyellow" : 
                post.postStatus === "success" ? "text-green-500" : "text-gray-500"
            }`}
            >
            Status: {post.postStatus}
        </p>

        <Carousel className="col-span-2 w-full h-[40%] flex-auto">
                <CarouselContent>
                    {post?.postImageDisplay.map((image, index) => (
                    <CarouselItem key={index}>
                        <Card className="relative w-full aspect-video">
                            <Image
                            src={image.imageURL}
                            alt={`Project Image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg w-full h-full"
                            />
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                {/* <CarouselPrevious className="left-2" /> */}
                {/* <CarouselNext className="right-2" /> */}
        </Carousel>

        <Separator className="mt-5 col-span-2 h-1" />
        <div className="col-span-2 p-6 mt-4 rounded-lg h-[20%] ">
          <span className="text-xl font-bold ">Post Description</span>
          <div className="mt-2 w-full border max-h-[150px] rounded-xl bg-slate-50 overflow-auto p-3">
            {post.postDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
