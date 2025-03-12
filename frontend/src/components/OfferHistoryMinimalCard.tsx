import Image from "next/image"
import { OfferHistoryData } from "../../interface"
export default function OfferHistoryMinimalCard({productionProfessionalName,offerHisData}:{productionProfessionalName:string,offerHisData:OfferHistoryData}){
    const offerDate = new Date(offerHisData.createdAt)
    const displayDate = offerDate.toUTCString()
    return(
        <div className="flex flex-row  justify-center rounded-md p-2 shadow-lg bg-slate-400-100">
            <Image src="/image/logo.png" alt={"dd"}
            width={parent.innerWidth}
            height={parent.innerHeight}
            className="w-[20%] h-[100%]"
            />
            <div className="ml-3">
                <h1 className="font-bold">Name: {productionProfessionalName}</h1>
                <p className="font-bold">Role: {offerHisData.roleName}</p>
                <p className="font-bold">Send By: {offerHisData.offerBy?"production":"producer"}</p>
                <p className="font-bold">Offer Time: {displayDate}</p>
                <p className="font-bold">Price {(offerHisData.price).toString()}</p>
            </div>

        </div>
    )
}