// frontend/src/app/(logged-in)/my-offers/page.tsx

"use client";
import OfferCard from "@/components/OfferCard";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OfferData } from "../../../../interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function OffersPage() {
  const { data: session, status } = useSession();
  const [offerArray, setOfferArray] = useState<Array<OfferData>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      handleFetch(activeTab);
    }
  }, [session, status, activeTab]);

  const handleFetch = async (offerStatus: string) => {
    try {
      setIsLoading(true);
      const query = `?offerStatus=${offerStatus}&limit=10&page=1`;
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/offers/producer${query}`;
      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      console.log("offersRes", res);
      setOfferArray(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOfferArray([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOffers = offerArray.filter(
    (offer) =>
      offer.professionalName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      offer.postName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.roleName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const router = useRouter();

  const handleChangePage = (postID: string) => {
    router.push(`/my-offers/${postID}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <main className="min-h-screen flex flex-col gap-5 pb-10">
      <div className="mt-20 gap-5 flex flex-col px-4 md:px-8">
        <span className="text-4xl md:text-5xl font-bold text-center">
          My Offers
        </span>

        <div className="relative w-full max-w-md mx-auto mt-2 mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search by name, post, or role..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="all"
          className="w-full max-w-3xl mx-auto"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-40 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : filteredOffers.length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredOffers.map((offer, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleChangePage(offer?.postId!)}
                  >
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No offers found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-40 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : filteredOffers.filter((offer) => offer.status === "pending")
                .length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredOffers
                  .filter((offer) => offer.status === "pending")
                  .map((offer, index) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      onClick={() => handleChangePage(offer?.postId!)}
                    >
                      <OfferCard offer={offer} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending offers found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-40 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : filteredOffers.filter((offer) => offer.status === "accepted")
                .length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredOffers
                  .filter((offer) => offer.status === "accepted")
                  .map((offer, index) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      onClick={() => handleChangePage(offer?.postId!)}
                    >
                      <OfferCard offer={offer} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No accepted offers found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-40 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : filteredOffers.filter((offer) => offer.status === "rejected")
                .length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredOffers
                  .filter((offer) => offer.status === "rejected")
                  .map((offer, index) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      onClick={() => handleChangePage(offer?.postId!)}
                    >
                      <OfferCard offer={offer} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No rejected offers found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
