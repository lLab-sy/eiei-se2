
// frontend/src/components/OfferCard.tsx

"use client";
import { OfferData } from "../../interface";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import { Separator } from "./ui/separator";

export default function OfferCard({ offer }: { offer: OfferData }) {
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Format time ago
  const getTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Status badge color
  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case "accepted":
        return "bg-green-500 hover:bg-green-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-black";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={offer.professionalImage || "/api/placeholder/48/48"} 
                  alt={offer.professionalName || "Professional"} 
                />
                <AvatarFallback>
                  {offer.professionalName?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{offer.professionalName || "Unknown Professional"}</h3>
                <p className="text-sm text-gray-500">{offer.roleName || "Role Not Specified"}</p>
              </div>
            </div>
            <Badge className={getStatusBadgeClass(offer.status || "pending")}>
              {offer.status || "Pending"}
            </Badge>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-medium">Post: {offer.postName || "Untitled Post"}</h4>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {offer.reason || "No details provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon size={14} className="mr-1" />
              <span>{formatDate(offer.createdAt)}</span>
            </div>
            <div className="flex items-center justify-end text-sm text-gray-500">
              <span className="font-medium text-base">฿{offer.currentWage?.toLocaleString() || "0"}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between py-3 px-6 bg-gray-50">
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>{getTimeAgo(offer.createdAt)}</span>
        </div>
        <div className="text-sm text-gray-600">
          Click to view details
        </div>
      </CardFooter>
    </Card>
  );
}