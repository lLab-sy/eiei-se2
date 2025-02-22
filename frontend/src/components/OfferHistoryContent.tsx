// frontend/src/components/OfferHistoryContent.tsx

"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { MessageCircle, User } from "lucide-react";

export interface OfferHistoryInterface {
  _id: string;
  roleName: string;
  reason: string;
  postName: string;
  currentWage: number;
  professionalId: string;
  professionalName: string;
  professionalImage?: string;
  createdAt: string;
  status: string;
}

export default function OfferHistoryContent({
  data,
}: {
  data: OfferHistoryInterface;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    wage: data.currentWage,
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // View professional profile
  const viewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${data.professionalId}`);
  };

  // Submit new offer
  const submitNewOffer = async () => {
    if (!newOffer.reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your new offer",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/offers/negotiate`,
        {
          offerId: data._id,
          newWage: newOffer.wage,
          reason: newOffer.reason,
        },
      );

      toast({
        title: "Success",
        description: "Your offer has been sent successfully",
      });
      setIsDialogOpen(false);
      // Refresh the page or refetch data
      router.refresh();
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast({
        title: "Error",
        description: "Failed to send your offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage
                src={data.professionalImage || "/api/placeholder/40/40"}
                alt={data.professionalName}
              />
              <AvatarFallback>
                {data.professionalName?.charAt(0) || "P"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base">{data.professionalName}</h3>
              <p className="text-sm text-muted-foreground">{data.roleName}</p>
            </div>
          </div>
          {getStatusBadge(data.status)}
        </div>

        <div className="mt-4 bg-slate-50 p-3 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Offered Amount
            </span>
            <span className="font-medium">
              ฿{data.currentWage.toLocaleString()}
            </span>
          </div>
          <p className="text-sm line-clamp-3">
            {data.reason || "No additional details provided."}
          </p>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          Sent on {formatDate(data.createdAt)}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={viewProfile}
          className="text-xs"
        >
          <User size={14} className="mr-1" />
          View Profile
        </Button>

        {data.status === "pending" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs">
                <MessageCircle size={14} className="mr-1" />
                Negotiate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Negotiate Offer</DialogTitle>
                <DialogDescription>
                  Send a new offer to {data.professionalName} for the role of{" "}
                  {data.roleName}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    New Amount (฿)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    value={newOffer.wage}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, wage: Number(e.target.value) })
                    }
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Reason for New Offer
                  </label>
                  <Textarea
                    id="reason"
                    value={newOffer.reason}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, reason: e.target.value })
                    }
                    placeholder="Explain why you're adjusting the offer..."
                    rows={4}
                  />
                </div>
              </div>

              <Separator />

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={submitNewOffer} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Offer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {data.status === "accepted" && (
          <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
            Contact
          </Button>
        )}

        {data.status === "rejected" && (
          <Button
            size="sm"
            className="text-xs"
            variant="outline"
            onClick={() => {
              setNewOffer({
                wage: data.currentWage,
                reason: "",
              });
              setIsDialogOpen(true);
            }}
          >
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
