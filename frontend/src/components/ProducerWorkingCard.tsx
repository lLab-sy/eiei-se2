
import { Card } from "@/components/ui/card";
import { Calendar, Star, StarIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ICardProp {
  id: string;
  status: string;
  date: Date;
  amount: string;
  postName: string;
  role: string;
  startDate: Date;
  description: string;
  productionName: string;
  reviews: number;
  professionalImg: string;
}

export default function ProducerWorkingCard(offer: ICardProp){ 
  const [open, setOpen] = useState(false);
  return (
    <>
    <Card
        key={offer.id}
        className="p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Offer {offer.id}</h3>
        <span className={`font-semibold ${
                offer.status === "Created" ? "text-mainblue-light" : 
                offer.status === "Rejected" ? "text-mainred-light" : 
                offer.status === "Pending" ? "text-mainyellow" : 
                offer.status === "Completed" ? "text-green-500" : "text-gray-500"
            }`}>{offer.status}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
          <Calendar size={14} />
          <span>{offer.date.toString()}</span>
        </div>
        <div className="mt-2 text-right text-lg font-semibold">{offer.amount} THB</div>
    </Card>

    {/* Popup Modal */}
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 rounded-lg border shadow-lg overflow-hidden" >
          
          <div className="bg-blue-700 text-white p-4">
            <h2 className="text-lg font-bold">Confirm Offer: {offer.postName}</h2>
            <p className="text-sm">Role: {offer.role}</p>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
              <img 
                src={offer.professionalImg || "/default-avatar.png"} 
                alt="Production" 
                className="w-full h-full object-cover" 
              />
            </div>
              <div>
                <p className="font-semibold">From: {offer.productionName}</p>
                <p className="flex items-center gap-2 font-medium"><Star className="h-6 w-6 text-mainyellow fill-current" />{offer.reviews}</p>
              </div>
            </div>
            <hr className="my-3" />
            <p className="mt-2"><strong>Offered Price:</strong> <span className="font-bold">{offer.amount} THB</span></p>
            <p><strong>Start Date:</strong> {offer.startDate.toString()}</p>
            <p className="mt-2"><strong>Description</strong></p>
            <div className="mt-1 p-3 bg-gray-100 border rounded-md text-sm">
              {offer.description}
            </div>
          </div>
          <div className="flex justify-between p-4">
            <Button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setOpen(false)}>Reject Offer</Button>
            <Button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setOpen(false)}>Confirm Offer</Button>
          </div>

          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Confirm Offer</VisuallyHidden>
            </DialogTitle>
          </DialogHeader>
          
        </DialogContent>
      </Dialog>
    </>
  );
}
