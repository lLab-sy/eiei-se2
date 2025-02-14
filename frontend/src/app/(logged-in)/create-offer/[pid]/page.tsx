"use client"
import PostSelect from "@/components/PostSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "../../../../../interface";
import { useState } from "react";

const mockData=[
    {
      "id": "1",
      "postName": "Short Film Production",
      "postDescription": "A short film about the journey of self-discovery.",
      "postImages": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "postMediaType": "Film",
      "postProjectRoles": ["Director", "Actor", "Cinematographer"],
      "postStatus": "Ongoing",
      "startDate": "2025-02-01T00:00:00.000Z",
      "endDate": "2025-05-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "postName": "Music Video Collaboration",
      "postDescription": "A high-energy music video for an upcoming artist.",
      "postImages": [
        "https://example.com/music1.jpg",
        "https://example.com/music2.jpg"
      ],
      "postMediaType": "Music Video",
      "postProjectRoles": ["Editor", "Choreographer", "Dancer"],
      "postStatus": "Planning",
      "startDate": "2025-03-10T00:00:00.000Z",
      "endDate": "2025-06-15T00:00:00.000Z"
    },
    {
      "id": "3",
      "postName": "Podcast Series",
      "postDescription": "A deep dive into the creative industry with expert guests.",
      "postImages": [
        "https://example.com/podcast1.jpg"
      ],
      "postMediaType": "Podcast",
      "postProjectRoles": ["Host", "Audio Engineer", "Guest Speaker"],
      "postStatus": "Completed",
      "startDate": "2024-09-01T00:00:00.000Z",
      "endDate": "2024-12-15T00:00:00.000Z"
    }
  ]
export default function CreateOfferPage({productionProfessionalID}:{productionProfessionalID:string}){
    
    const [postData,setPostData]= useState<Project[]|null>(mockData)
    const [postSelect,setPostSelect] = useState<Project|null>(mockData[0])

    if(!postSelect || !postData){
        return <>Loading...</>
    }
    return(
        <div className="flex bg-mainblue-light justify-center min-h-screen">
            <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
            <Card className="w-[100%] shadow-xl">
                <CardHeader>
                    <CardTitle className="justify-start flex">Name of Prodcution</CardTitle>
                </CardHeader>
                {/* Drag Line */}
                <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr> 
                
                <PostSelect postData={postData} postSelectData={postSelect} changePostSelect={setPostSelect}/>
                
                <div className="flex flex-row">
                    <CardContent className="flex flex-col py-5 w-[100%]">

                    </CardContent>
                </div>

            </Card>
            </div>
        </div>
    )
}