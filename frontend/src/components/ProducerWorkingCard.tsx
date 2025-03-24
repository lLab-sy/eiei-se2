import { Card } from "@/components/ui/card";
import { Calendar, Star, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import patchChangeParticipantStatus from "@/libs/patchChangeParticipantStatus";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
  productionID: string;
  reviews: number;
  professionalImg: string;
  offeredBy: number;
}

export default function ProducerWorkingCard({ 
  postID, participantID, offer, onStatusChange
}: { 
  postID: string, 
  participantID: string, 
  offer: ICardProp,
  onStatusChange: (participantID: string, status: string) => void
}) {
  const [open, setOpen] = useState(false);
  const [openCounter, setOpenCounter] = useState(false);
  const [offerStatus, setOfferStatus] = useState(offer.status);

  const { data: session } = useSession();
  const token = session?.user?.token;
  const { toast } = useToast();
  const router = useRouter();
  const fromWho = offer.offeredBy === 0 ? "Production Professional" : "Producer";

  function handleReject(): void {
    setOpen(false);
    if (token) {
      patchChangeParticipantStatus({
        postID: postID,
        participantID: participantID,
        statusToChange: "reject"
      }, token);
      onStatusChange(participantID, "reject");
      setOfferStatus("Rejected");
      toast({
        variant: "default",
        title: "Successful Reject Offer.",
      })
    } else {
      console.error("Token is undefined");
    }
  }

  function handleConfirm(): void {
    setOpen(false);
    if (token) {
      patchChangeParticipantStatus({
        postID: postID,
        participantID: participantID,
        statusToChange: "candidate"
      }, token);
      onStatusChange(participantID, "candidate");
      setOfferStatus("Completed");
      toast({
        variant: "default",
        title: "Successful Confirm Offer.",
      })
    } else {
      console.error("Token is undefined");
    }
  }

  function handleCounter(): void {
    setOpen(false);
    setOpenCounter(true);
  }

  function handleCounterNo(): void {
    setOpenCounter(false);
  }

  function handleCounterYes(): void {
    setOpenCounter(false);
    router.push(`/create-offer/${offer.productionID}`)
  }

  useEffect(() => {
    setOfferStatus(offer.status);
}, [offer]);

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
               offerStatus === "Rejected" ? "text-mainred-light" : 
               offerStatus === "Pending" ? "text-mainyellow" : 
               offerStatus === "Completed" ? "text-green-500" : "text-gray-500"
            }`}>{offerStatus}</span>
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
            <h2 className="text-lg font-bold">Offer {offer.postName}</h2>
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
                <p className="font-semibold">From: {fromWho}</p>
                <p className="flex items-center gap-2 font-medium"><Star className="h-6 w-6 text-mainyellow fill-current" />{offer.reviews}</p>
              </div>
            </div>
            <hr className="my-3" />
            <p className="mt-2"><strong>Offered Price:</strong> <span className="font-bold">{offer.amount} THB</span></p>
            <p><strong>Start Date:</strong> {offer.startDate.toString()}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${
                offer.status === "Rejected" ? "text-mainred-light" : 
                offer.status === "Pending" ? "text-mainyellow" : 
                offer.status === "Completed" ? "text-green-500" : "text-gray-500"
            }`}>{offer.status}</span></p>
            <p className="mt-2"><strong>Description</strong></p>
            <div className="mt-1 p-3 bg-gray-100 border rounded-md text-sm">
              {offer.description}
            </div>
          </div>
          <div className="flex justify-between p-4">
            {offerStatus === "Pending" && 
              <Button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleReject}>
                Reject Offer
              </Button>}
            {offerStatus === "Pending" && 
              <Button className="bg-mainblue-light text-white px-4 py-2 rounded" onClick={handleCounter}>
                Counter Offer
              </Button>}
            {offerStatus === "Pending" && 
              <Button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleConfirm}
              disabled={fromWho === "Producer"}>
                Confirm Offer
              </Button>}
          </div>

          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Confirm Offer</VisuallyHidden>
            </DialogTitle>
          </DialogHeader>
          
        </DialogContent>
      </Dialog>

      <Dialog open={openCounter} onOpenChange={setOpenCounter}>
        <DialogContent className="max-w-lg p-0 rounded-lg border shadow-lg overflow-hidden" >
          
          <div className="bg-blue-700 text-white p-4">
            <h2 className="text-lg font-bold">Offer {offer.postName}</h2>
            <p className="text-sm">Role: {offer.role}</p>
          </div>
          <div className="flex justify-between p-4"> You are about to be redirected to the Create Offer page. Are you sure? </div>
          <div className="flex justify-between p-4">
              <Button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCounterNo}>
                No
              </Button>
              <Button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCounterYes}>
                Yes
              </Button>

          </div>

          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Counter Offer</VisuallyHidden>
            </DialogTitle>
          </DialogHeader>
          
        </DialogContent>
    </Dialog>

    </>
  );
}
