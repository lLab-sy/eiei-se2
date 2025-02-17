"use client"
import Image from "next/image"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useState } from "react";
import { Project } from "../../interface";

  
export default function PostSelect({postData,postSelectData,changePostSelect}:{postData:Project[],postSelectData:Project,changePostSelect:Function}){
    const handleSelectChange= (selectID:string)=>{{
        const selectedPost = postData.find(post=>post.id===selectID);
        if(selectedPost && selectedPost.id!==postSelectData?.id){
            console.log("ChangPost")
            changePostSelect(selectedPost);
        }
    }}
    return(
        <div className="flex flex-col w-[75%] lg:w-[60%] m-auto">
            {/* <h1>{postSelectData.postName}</h1> */}
            <Image src="/image/logo.png"
                width={parent.innerWidth}
                height={parent.innerHeight}
                className="object-fill w-[100%] h-[40%] m-auto" 
                alt="Project Picture"
            />
            
            <Select 
                onValueChange={handleSelectChange}
                value={postSelectData?.id || ""}
            >
                <SelectTrigger className="shadow-lg">
                    <SelectValue placeholder="Choose your Post"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                          {
                            postData.map((eachPost:Project)=>(
                            <SelectItem key={eachPost.id} value={eachPost.id}>{eachPost.postName}</SelectItem>
                            ))
                            }
                    </SelectGroup>
                </SelectContent>
            </Select>
            


        </div>
    )
}