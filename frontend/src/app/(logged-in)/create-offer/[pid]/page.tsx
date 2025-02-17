"use client"
import { use } from "react";
import PostSelect from "@/components/PostSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfferHistoryData, Project } from "../../../../../interface";
import { useEffect, useState } from "react";
import OfferInformation from "@/components/OfferInformation";
import getPostUser from "@/libs/getPostsUser";
import { useSession } from "next-auth/react";
import { FaHistory } from "react-icons/fa";
import OfferHistoryMinimal from "@/components/OfferHistoryMinimal";

const mockOfferHistory: OfferHistoryData[] = [
    {
      roleName: "Lead Actor",
      price: 5000,
      offerBy: 1,
      createdAt: "2024-02-17T10:30:00Z",
      detail: "Experienced actor with multiple awards."
    },
    {
      roleName: "Supporting Actor",
      price: 3000,
      offerBy: 0,
      createdAt: "2024-02-16T15:45:00Z",
      detail: "Trained in theater and on-screen performances."
    },
    {
      roleName: "Cinematographer",
      price: 7000,
      offerBy: 1,
      createdAt: "2024-02-15T12:00:00Z",
      detail: "Expert in lighting and camera work for films."
    },
    {
      roleName: "Director",
      price: 10000,
      offerBy: 0,
      createdAt: "2024-02-14T09:20:00Z",
      detail: "Award-winning director with 15 years of experience."
    },
    {
      roleName: "Editor",
      price: 4000,
      offerBy: 0,
      createdAt: "2024-02-13T18:10:00Z",
      detail: "Specialized in post-production and visual effects."
    },
    {
      roleName: "Sound Designer",
      price: 3500,
      offerBy: 0,
      createdAt: "2024-02-12T14:30:00Z",
      detail: "Proficient in Foley and sound mixing."
    },
    {
      roleName: "Production Assistant",
      price: 2000,
      offerBy: 1,
      createdAt: "2024-02-11T16:50:00Z",
      detail: "Energetic and organized for on-set coordination."
    }
  ];
export default function CreateOfferPage({params}:{params:Promise<{pid:string}>}){
    const {data:session} = useSession()
    const { pid } = use(params);
    const producerID= session?.user.id //เจ้าของโพสต์
    const [postData,setPostData]= useState<Project[]|null>()
    const [postSelect,setPostSelect] = useState<Project|null>()
    const [showOfferHistory, setShowOfferHistory] = useState(false); // State for OfferHistoryMinimal
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
                <CardHeader className="justify-between flex flex-row">
                    <CardTitle className="flex">Name of Prodcution</CardTitle>
                    <FaHistory className="cursor-pointer" onClick={() => setShowOfferHistory(true)} />
                </CardHeader>
                {/* Drag Line */}
                <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr> 
                
                <PostSelect postData={postData} postSelectData={postSelect} changePostSelect={setPostSelect}/>
                
                <div className="flex flex-row">
                    <CardContent className="flex flex-col py-5 w-[100%]">
                        <CardTitle className="justify-start flex mb-5">Offer Information</CardTitle>
                        <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr>
                        <OfferInformation postSelectData={postSelect} productionProfessionalID={pid}/>
                    </CardContent>
                </div>

            </Card>
            </div>
            {showOfferHistory && <OfferHistoryMinimal productionProfessionalName={pid} offerHistoryDatas={mockOfferHistory} onCloseWindow={() => setShowOfferHistory(false)} />}
        </div>
    )
}