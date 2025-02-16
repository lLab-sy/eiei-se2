"use client"
import PostSelect from "@/components/PostSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "../../../../../interface";
import { useEffect, useState } from "react";
import OfferInformation from "@/components/OfferInformation";
import getPostUser from "@/libs/getPostsUser";
import { useSession } from "next-auth/react";
 


export default function CreateOfferPage({productionProfessionalID}:{productionProfessionalID:string}){
    const {data:session} = useSession()
    const producerID= session?.user.id //เจ้าของโพสต์
    const [postData,setPostData]= useState<Project[]|null>()
    const [postSelect,setPostSelect] = useState<Project|null>()
    if(!producerID){
      return <>Loading...</>
    }
    useEffect(()=>{
      const fetchData=async()=>{
          const response= await getPostUser(producerID)
          const posts=response.data.data
          setPostData(posts)
          setPostSelect(posts[0])
      }
      fetchData()
  },[])

    if(!postSelect || !postData){
        return <>Loading...</>
    }
    return(
        <div className="flex bg-mainblue-light justify-center min-h-screen">
            <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
            <Card className="w-[100%] shadow-xl mt-10">
                <CardHeader>
                    <CardTitle className="justify-start flex">Name of Prodcution</CardTitle>
                </CardHeader>
                {/* Drag Line */}
                <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr> 
                
                <PostSelect postData={postData} postSelectData={postSelect} changePostSelect={setPostSelect}/>
                
                <div className="flex flex-row">
                    <CardContent className="flex flex-col py-5 w-[100%]">
                        <CardTitle className="justify-start flex mb-5">Offer Information</CardTitle>
                        <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr>
                        <OfferInformation postSelectData={postSelect}/>
                    </CardContent>
                </div>

            </Card>
            </div>
        </div>
    )
}