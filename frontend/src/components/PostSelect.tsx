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
    const [selectPostID,setSelectPostID]= useState() //may be use handler function
    return(
        <div>
            <Image src="/image/logo.png"
                width={100}
                height={100}
                className="w-100 h-100" 
                alt="Project Picture"
            />
            
            <Select
                // onValueChange={field.onChange}
                // value={field.value}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Choose your media type." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="ads">Ads</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>


        </div>
    )
}