import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Airplay, Bitcoin, CircleCheck, CircleX, Clock9, SearchCheck, Timer } from "lucide-react";
import { historyStateInterface } from "./HistoryProduction";

export default function HistoryProductionContent({data} : {data : historyStateInterface}) {
  const offerDate = new Date(data.createdAt)
  const displayDate = offerDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  const colarMapping = {
    'candidate' : <Timer />,
    "reject" : <CircleX />,
    "in-progress" : <SearchCheck />
  }
  return (
    <div className="cursor-pointer mt-3 group bg-white flex h-[120px] rounded-lg shadow-lg">
      <div
        style={{
          transition: "transform 1s ease",
        }}
        className="group-hover:translate-x-4 w-[20%] flex justify-center items-center h-full relative"
      >
        <Airplay size={30} />
      </div>
      <div className="w-[80%] h-full flex flex-row justify-between">
        <div className="flex flex-col justify-center">
          <span>Offer By: {data.offeredBy}</span>
          <span>Role: {data.roleName}</span>
          <span>Offer Time: {displayDate}</span>
          <span>Status: {data.status}</span>
        </div>
        <div className="flex w-[30%] group items-center mr-2 relative">
          <Bitcoin
            style={{
              transition: "color 1s ease",
            }}
            size={50}
            className={`group-hover:text-green-500`}
          />
          <div className='absolute right-1 top-1'>
            {
              (data.status === 'candidate') ? <CircleCheck color="#00b083" strokeWidth={2} /> : 
              (data.status === 'in-progress') ? <Clock9 color='#3e47dc' strokeWidth={2} /> : <CircleX color="#ff3e0c" />
            }
          </div>
          <span className="text-2xl">{data.currentWage}</span>
        </div>
      </div>
    </div>
  );
}
