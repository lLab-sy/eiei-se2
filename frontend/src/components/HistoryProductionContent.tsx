import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Airplay, Bitcoin } from "lucide-react";
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
  return (
    <div className="cursor-pointer mt-3 group bg-white w-full flex h-[120px] rounded-lg shadow-lg">
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
        </div>
        <div className="flex w-[30%] group items-center mr-2">
          <Bitcoin
            style={{
              transition: "color 1s ease",
            }}
            size={50}
            className={`group-hover:text-green-500`}
          />
          <span className="text-2xl">{data.currentWage}</span>
        </div>
      </div>
    </div>
  );
}
