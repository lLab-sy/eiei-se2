// frontend/src/components/OfferHistory.tsx

"use client";
import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import OfferHistoryContent, {
  OfferHistoryInterface,
} from "./OfferHistoryContent";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import OfferReadContent from "./OfferReadContent";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function OfferHistory({
  userId,
  session,
  postId,
}: {
  userId: string;
  session: any;
  postId?: string;
}) {
  const [historyState, setHistoryState] = useState<
    Array<OfferHistoryInterface>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.session) {
      return;
    }

    const handleFetch = async (userId: string, status: string) => {
      try {
        setIsLoading(true);
        const query = postId
          ? `?producerId=${userId}&postId=${postId}&limit=10&page=1`
          : `?producerId=${userId}&limit=10&page=1`;
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/offers/history${query}`;
        const res = await axios.get(apiUrl);
        setHistoryState(res?.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching offer history:", error);
        setHistoryState([]);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetch(userId, "all");
  }, [session?.session, userId, postId]);

  const [isRead, setIsRead] = useState(false);
  const [pageState, setPageState] = useState(0);

  const clickRead = (key: number) => {
    setIsRead(true);
    setPageState(key);
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => setIsRead(false)}
        className="h-30 w-full rounded-md"
      >
        <History />
      </DialogTrigger>
      <DialogContent
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="overflow-y-auto scroll-p-0 h-[70%] flex flex-col"
      >
        <DialogTitle className="flex items-center h-[10%]">
          Offer History
        </DialogTitle>
        {isLoading ? (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 bg-gray-100 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        ) : isRead ? (
          <OfferReadContent offer={historyState[pageState]} />
        ) : (
          <div className="p-2">
            {historyState && historyState.length > 0 ? (
              historyState.map((data, index) => (
                <div
                  key={index}
                  onClick={() => clickRead(index)}
                  className="mb-4 cursor-pointer"
                >
                  <OfferHistoryContent data={data} />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">No offer history found</p>
              </div>
            )}
          </div>
        )}
        <Button
          className={`${isRead ? "" : "hidden"}`}
          onClick={() => setIsRead(false)}
        >
          Back
        </Button>
      </DialogContent>
    </Dialog>
  );
}
