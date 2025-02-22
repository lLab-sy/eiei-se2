// frontend/src/components/OfferReadContent.tsx

"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { OfferHistoryInterface } from "./OfferHistoryContent";
import { useRouter } from "next/navigation";
import { CalendarIcon, LucideBanknote, User } from "lucide-react";

export default function OfferReadContent({
  offer,
}: {
  offer: OfferHistoryInterface;
}) {
  const router = useRouter();

  if (!offer) {
    return <div>No offer data available</div>;
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500";
    }
  };

  const viewProfile = () => {
    router.push(`/profile/${offer.professionalId}`);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={offer.professionalImage || "/api/placeholder/64/64"}
              alt={offer.professionalName}
            />
            <AvatarFallback>
              {offer.professionalName?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{offer.professionalName}</h2>
            <p className="text-gray-500">{offer.roleName}</p>
          </div>
        </div>
        <Badge className={getStatusColor(offer.status)}>{offer.status}</Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Post</p>
          <p className="font-medium">{offer.postName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date Sent</p>
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-1" />
            <p>{formatDate(offer.createdAt)}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Offered Amount</p>
          <div className="flex items-center">
            <LucideBanknote size={14} className="mr-1" />
            <p className="font-semibold">
              ฿{offer.currentWage.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <Card className="p-4 bg-gray-50">
        <h3 className="font-medium mb-2">Offer Details</h3>
        <p className="whitespace-pre-wrap">
          {offer.reason || "No additional details provided."}
        </p>
      </Card>

      <div className="mt-auto">
        <Button
          onClick={viewProfile}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <User size={16} className="mr-2" />
          View Professional Profile
        </Button>
      </div>
    </div>
  );
}
