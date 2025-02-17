import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaTimes } from "react-icons/fa";
import OfferHistoryMinimalCard from "./OfferHistoryMinimalCard";
import { OfferHistoryData } from "../../interface";
export default function OfferHistoryMinimal({productionProfessionalName,onCloseWindow,offerHistoryDatas}:{productionProfessionalName:string,onCloseWindow:Function,offerHistoryDatas:OfferHistoryData[]}){
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-[80%] max-h-[80vh] shadow-xl bg-white relative">
            <CardHeader className="justify-between flex flex-row">
                <CardTitle className="flex">Offer History</CardTitle>
                <FaTimes className="cursor-pointer text-red-500" onClick={()=>{onCloseWindow(false)}} />
            </CardHeader>

            <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr>
            <CardContent className="flex flex-col py-5 w-[100%] max-h-[60vh] overflow-y-auto space-y-3 m-auto">
                {
                    offerHistoryDatas.map((eachOfferData,index)=>(
                        <OfferHistoryMinimalCard key={eachOfferData.createdAt} productionProfessionalName={productionProfessionalName} offerHisData={eachOfferData}></OfferHistoryMinimalCard>
                    ))
                }
            </CardContent>
            </Card>
        </div>
        
    )
}