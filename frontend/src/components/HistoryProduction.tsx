"use client";
import { History } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import HistoryProductionContent from "./HistoryProductionContent";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import HistoryReadContent from "./HistoryReadContent";
import axios from "axios";
import { useSession } from "next-auth/react";
export interface historyStateInterface {
  _id : string,
  roleName : string,
  reason :string,
  postName : string,
  currentWage : number,
  offeredBy : boolean,
  createdAt : string
}
export default function HistoryProduction({userId, session} : {userId: string, session : any}) {
  const mockData = [
    {
        role: "Professional",
        price : 300,
        offerBy : "Tien",
        createdAt : "3/12/12",
        reason : "Shinigi conan sakura"
    },
    {
      role: "Tiensional",
      price : 500,
      offerBy : "Teratas",
      createdAt : "22/22/11",
      reason : "You are my friend ah ah jdhajksdhaishddaskjdaisdjasja djasdjasjdasjd iajsdoajsdjdijaios djaosdjaso ajsodjasio hdjjdjasjhdiajsiod jaisjdiasjdijasidjiasjdaisodjaisdjaiosdj ashdjashdiuahsd hasudh uashdiuhas udhasudhasuidash dashdiusahdasdisidu"
  }
  ];
  console.log('history session', session)
  const [historyState, setHistoryState] = useState<Array<historyStateInterface>>([])
  useEffect(()=> {
    if(!session?.session){
      return;
    }
    const handleFetch = async (userId : string, postStatus: string) => {
      const query = `?userId=${userId}&postStatus=${postStatus}&limit=10&page=1`
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/get-offer${query}`;
      const res = await axios.get(apiUrl)
      setHistoryState(res?.data?.data?.data)
    } 
    handleFetch(userId, "created")
  }, [session?.session])
  console.log("historyState",historyState)
  const [isRead, setIsRead] = useState(false);
  const [pageState, setPageState] = useState(0);
  const clickRead = (key : number) => {
    setIsRead(true);
    setPageState(key)
  };
  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => setIsRead(false)}
        className="h-30 w-full rounded-md "
      >
        <History />
      </DialogTrigger>
      <DialogContent
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className=" overflow-y-auto scroll-p-0 h-[70%] flex flex-col"
      >
        <DialogTitle className="flex items-center h-[10%]">
          Offer History
          
        </DialogTitle>
        {isRead ? (
          <HistoryReadContent readContent={historyState[pageState]} />
        ) : (
          <div className=''>
            {
              (historyState && historyState.length > 0) ? historyState.map((data, index) => (
                <div key={index} onClick={() => clickRead(index)}>
                  <HistoryProductionContent key={index} data={data}/>
                </div>
              )) : ""
              
            }

            {/* <div onClick={clickRead}>
              <HistoryProductionContent data={mockData[0]}/>
            </div>
            <div onClick={clickRead}>
              <HistoryProductionContent data={mockData[1]}/>
            </div> */}
          </div>
        )}
        <Button
            className={`${isRead ? "" : "hidden"}`}
            onClick={() => setIsRead(false)}
          >
            Back
        </Button>
      </DialogContent>
      
    </Dialog>
  );
}
