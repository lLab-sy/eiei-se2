"use client";
import HistoryProduction, { historyStateInterface } from "@/components/HistoryProduction";
import OfferContent from "@/components/OfferContent";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostData } from "../../../../../interface";
import HistoryProductionContent from "@/components/HistoryProductionContent";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function OfferPostContent() {
  const user : any = useSelector<RootState>(state => state.user.user)
  const { postID } : { postID : string} = useParams();
  const router = useRouter();
  const [offerArray, setOfferArray] = useState<Array<historyStateInterface>>([])
  const handleBack = () => {
    router.push("/my-offering");
  };
  const userId = user?._id ?? ""
  console.log('userOffer', userId)
  useEffect(() => {
    const handleFetch = async (userId : string) => {
      const query = `?postId=${postID}&userId=${userId}&limit=10&page=1`;
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/get-offer${query}`;
      const res = await axios.get(apiUrl)
      setOfferArray(res?.data?.data?.data)
    };
    handleFetch(userId)
  }, []);
  const [postState, setPostState] = useState<PostData | null>(null)
  useEffect(() => {
    const handleFetch = async (postID : string) => {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postID}`;
      const res = await axios.get(apiUrl)
      setPostState(res?.data?.data ?? {})
    }
    handleFetch(postID)
  }, [])
  const offerDateStart = new Date(postState?.startDate ?? "")
    const startDate = offerDateStart.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',

    })
    const offerDateEnd = new Date(postState?.endDate ?? "")
    const endDate = offerDateEnd.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',

    })
  console.log('PostState', postState)
  return (
    <main className=" flex flex-col h-[100vh] gap-3 relative mb-5">
      

      <div className="mt-20 flex flex-row gap-5 items-centerw-full h-full">
      
      <div className=' w-[50%] absolute flex justify-start ml-5'>
          <Button
            onClick={handleBack}
            className="w-[100px]"
            variant={"destructive"}
          >
            Back
          </Button>
      </div>
      
        <div className='w-[50%] flex justify-center items-center h-full'>
          <div className='w-[80%]  h-[80%] rounded-3xl'>
            
            <div className='p-5 flex flex-col shadow-lg border  h-[80%] bg-white w-full rounded-lg'>
              
              <span className='text-2xl w-full flex justify-center font-bold'>Post History</span>
              <div className='px-5 flex justify-between mt-5'>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>Post Name</span>
                  <span>{postState?.postName}</span>
                </div>

                  <div className='flex flex-col '>
                    <span className='text-sm text-muted-foreground'>Start Date</span>
                    <span>{startDate}</span>
                  </div>
                  
                
              </div>
              <div className='px-5 flex justify-between mt-5'>
                <div className='flex flex-col'>
                    <span className='text-sm text-muted-foreground'>Status</span>
                    <span className='text-xl text-orange-400'>{postState?.postStatus}</span>
                </div>

                  <div className='flex flex-col '>
                    <span className='text-sm text-muted-foreground'>End Date</span>
                    <span>{endDate}</span>

                  </div>
                
              </div>
              <Separator className='mt-5' />
              <div className='p-6 mt-4 h-full rounded-lg'>
                <span className='text-xl'>Post Description</span>
                <div className='mt-2 w-full border h-[90%] rounded-xl bg-slate-50 p-5'>{postState?.postDescription}</div>
              </div>
            </div>
            
          </div>
        </div>
        <div className='w-[50%] border-l h-[80%] mt-20 shadow-lg rounded-lg'>
          <span className='text-2xl w-full mt-5 flex justify-center font-bold'>Offer History</span>

          <div style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className=' overflow-scroll flex flex-col w-[100%] h-full items-center flex-wrap gap-5'>
            {
                offerArray.map((offer, index) => (
                    <div key={index} className='mt-10'>
                        <HistoryProductionContent data={offer}/>
                    </div>
                ))
            }
          
                </div>
        </div>
      </div>
    </main>
  );
}
