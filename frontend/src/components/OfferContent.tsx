import { OfferHistoryData } from "../../interface";
import { historyStateInterface } from "./HistoryProduction";
import { Separator } from "./ui/separator";
// export interface historyStateInterface {
//     _id : string,
//     roleName : string,
//     reason :string,
//     postName : string,
//     currentWage : number,
//     offeredBy : boolean,
//     createdAt : string
//   }
export default function OfferContent({
  offerData,
}: {
  offerData: historyStateInterface;
}) {
  return (
    <div className="rounded-xl border  text-lg hover:bg-slate-50 flex h-[200px] w-full ">
      <div className="flex flex-col justify-around w-full py-2">
        <span className='px-5'>{`Role: ${offerData.roleName}`}</span>
        <Separator />
        <span className='px-5'>{`Amount: ${offerData.currentWage}`}</span>
        <Separator />
        <span className='px-5'>{`Created At: ${offerData.createdAt}`}</span>
        <Separator />
        <span className='px-5'>{`Reason: ${offerData.reason}`}</span>
      </div>
    </div>
  );
}
