// 4. src/components/OfferHistory.tsx
import { historyStateInterface } from "./HistoryProduction";
import HistoryProductionContent from "./HistoryProductionContent";
import { Button } from "./ui/button";

interface OfferHistoryProps {
  offers: historyStateInterface[];
  professionalName: string;
  userRole: "producer" | "professional";
  isLatestOffer: (offer: historyStateInterface) => boolean;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}
// 
export default function OfferHistory({
  offers,
  professionalName,
  userRole,
  isLatestOffer,
  onAccept,
  onReject,
}: OfferHistoryProps) {
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">
        Offer History - {professionalName}
      </h3>
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="overflow-y-auto flex flex-col w-full max-h-[560px] items-center gap-4"
      >
        {offers?.map((offer, index) => (
          <div key={index} className="w-full relative">
            <HistoryProductionContent data={offer} />

            {/* แสดงปุ่มสำหรับ Producer เพื่อตอบรับหรือปฏิเสธข้อเสนอเฉพาะล่าสุด */}
            {userRole === "producer" &&
              !offer.offeredBy &&
              offer.status === "candidate" &&
              isLatestOffer(offer) && (
                <div className="absolute right-2 bottom-2 flex gap-2 z-10">
                  <Button
                    onClick={() => onAccept(offer._id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => onReject(offer._id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
