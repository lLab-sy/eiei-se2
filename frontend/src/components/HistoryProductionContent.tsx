// 1. src/components/HistoryProductionContent.tsx
import { Airplay, Bitcoin } from "lucide-react";
import { historyStateInterface } from "./HistoryProduction";

export default function HistoryProductionContent({
  data,
}: {
  data: historyStateInterface;
}) {
  const offerDate = new Date(data.createdAt);
  // console.log(offerDate)
  const displayDate = offerDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ทำให้ status แสดงเป็นภาษาไทย
  const getStatusText = (status: string) => {
    switch (status) {
      case "candidate":
        return "Completed";
      case "reject":
        return "Rejected";
      case "in-progress":
        return "In-progress";
      default:
        return status;
    }
  };

  // ทำให้ offeredBy แสดงเป็นภาษาไทย
  const getOfferByText = (offeredBy: number) => {
    return offeredBy==1 ? "Producer" : "Professional";
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-lg">
            <Airplay size={16} className="text-gray-700" />
          </div>
          <span className="font-medium">Offer By:</span>
          <span>{getOfferByText(data?.offeredBy)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bitcoin size={16} className="text-gray-700" />
          <span className="text-lg font-medium">{data.currentWage}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Role:</span> {data.roleName}
        </div>
        <div>
          <span
            className={
              data.status === "in-progress"
                ? "text-yellow-500"
                : data.status === "candidate"
                  ? "text-green-500"
                  : "text-red-500"
            }
          >
            {" " + getStatusText(data.status)}
          </span>
        </div>
        <div className="col-span-2">
          <span className="font-medium">Offer Time:</span> {displayDate}
        </div>
      </div>
    </div>
  );
}
