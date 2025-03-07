import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaHistory } from "react-icons/fa"
import { OfferHistoryData } from "../../interface"
import OfferHistoryMinimalCard from "./OfferHistoryMinimalCard"

export function OfferHistoryMinimal2({productionProfessionalName,offerHistoryDatas}:{productionProfessionalName:string,offerHistoryDatas:OfferHistoryData[]}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaHistory className="cursor-pointer hover:text-mainblue transition-colors"/>
      </DialogTrigger>
      <DialogContent className="w-[80%] max-h-[80vh] shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex">Offer History</DialogTitle>
          <DialogDescription>
          <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col py-5 w-[100%] max-h-[60vh] overflow-y-auto space-y-3 m-auto">
             {
                offerHistoryDatas.map((eachOfferData,index)=>(
                    <OfferHistoryMinimalCard key={eachOfferData.createdAt} productionProfessionalName={productionProfessionalName} offerHisData={eachOfferData}></OfferHistoryMinimalCard>
                ))
            }
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
