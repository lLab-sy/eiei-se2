"use client"

import { Switch } from "./ui/switch";

export default function ProfessionalWorkingCard({workIter,isSend,isApprove,workTime,latest}:{workIter:number,isSend:boolean,isApprove:boolean,workTime:Date,latest:boolean}){ 
//   const offerDate = new Date(data.createdAt);
//   const displayDate = offerDate.toLocaleString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

    // api -> ก๊อปมาจากของ Tien
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
    <div className="w-full grid grid-cols-7 bg-slate-400 m-auto text-sm my-2 p-5 font-medium text-center whitespace-normal break-words h-[30px] items-center content-center">
        <div className="col-span-2">
            <p className="text-sm"> {latest&&isApprove?"complete":"in-progress"}</p>
        </div>
        <div className="col-span-2">
            <p className=""> {workIter+1}/3</p>
        </div>
        <div className="col-span-3">
            <p className=""> {new Date(workTime).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}</p>
        </div>
    </div>
  );
}
