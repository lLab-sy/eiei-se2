"use client"

import { Airplay } from "lucide-react";
import { Switch } from "./ui/switch";

export default function ProfessionalWorkingCard(){ 
//   const offerDate = new Date(data.createdAt);
//   const displayDate = offerDate.toLocaleString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

  const getStatusText = (status: string) => {
    switch (status) {
      case "candidate":
        return "Employed";
      case "reject":
        return "Banned";
      case "in-progress":
        return "Waiting";
      default:
        return status;
    }
  };


  return (
    <div className="w-full grid grid-cols-10 bg-slate-400 m-auto text-sm my-2 p-5 font-medium text-center whitespace-normal break-words h-[30px] items-center content-center">
        <div className="col-span-2">
            <p className="">Pro1</p>
        </div>
        <div className="col-span-2">
            <p className="">Actor</p>
        </div>
        <div className="col-span-2">
            <p className="text-sm">In-Progress</p>
        </div>
        <div className="col-span-2">
            <Switch/>
        </div>
        <div className="col-span-2">
            <p className=""> 0/5</p>
        </div>
    </div>
  );
}
