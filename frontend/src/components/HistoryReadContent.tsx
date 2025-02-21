import { Title } from "@radix-ui/react-dialog";
import { Bitcoin } from "lucide-react";
import { Separator } from "./ui/separator";
import { historyStateInterface } from "./HistoryProduction";

export default function HistoryReadContent({
  readContent} : {readContent: historyStateInterface}) {
    const offerDate = new Date(readContent.createdAt)
    const displayDate = offerDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
//   const { role, price, offerBy, createdAt, reason } = readContent;
  return (
    <div className='flex flex-col h-full text-lg'>
      <div className='flex justify-center items-center w-full h-[30%] rounded-xl bg-slate-100'>
        <span className='flex gap-2'>You received<span className="text-green-500 flex">{`${readContent.currentWage}B`}</span>  from {readContent.offeredBy}</span>
      </div>
      <div className='text-md py-3 mt-3 flex flex-col gap-2 border rounded-lg px-4'>
        <span className='flex justify-between'>
          <span>Post</span> 
          <span>{readContent.postName}</span>
        </span>
        
        <Separator />
        <span className='flex justify-between'>
          <span>Role</span> 
          <span>{readContent.roleName}</span>
        </span>
        
        <Separator />
        <span className='flex justify-between'>
          <span>Amount</span> 
          <span>{`${readContent.currentWage}B`}</span>
        </span>
        <Separator />
        <span className='flex justify-between'>
          <span>Created At</span> 
          <span>{displayDate}</span>
        </span>
      </div>
      <span className='mt-2'>Reason</span>
      <div className='mt-2 flex w-full h-[30%] rounded-xl border'>
        <span style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className='flex gap-2 h-full p-3 overflow-scroll'>{readContent.reason}</span>
      </div>
    </div>
  );
}
