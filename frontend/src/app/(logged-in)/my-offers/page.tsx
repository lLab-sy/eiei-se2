"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define an interface for your offers
interface OfferData {
  id: string;
  postId: string;
  postName: string;
  productionProfessionalId: string;
  producerId: string;
  role: string;
  expectation: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "pending" | "accepted" | "negotiating" | "rejected";
}

export default function MyOffersPage() {
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState<Array<OfferData>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setIsLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/offers/user`;

        const res = await axios.get(apiUrl, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });

        console.log("Offers response:", res);
        setOffers(res?.data?.data);
      } catch (error) {
        console.error("API Error:", error);

        // Mock data for development
        const mockOffers = [
          {
            id: "offer1",
            postId: "post123",
            postName: "โฆษณาผลิตภัณฑ์เสริมอาหาร",
            productionProfessionalId: "prof456",
            producerId: "producer789",
            role: "Director",
            expectation: "ต้องการผู้กำกับที่มีประสบการณ์ด้านโฆษณาอาหารเสริม",
            description:
              "รับผิดชอบการกำกับทีมงานและควบคุมการถ่ายทำให้เป็นไปตามวิสัยทัศน์",
            startDate: "2024-04-01T00:00:00.000Z",
            endDate: "2024-04-15T00:00:00.000Z",
            price: 30000,
            status: "pending",
          },
          {
            id: "offer2",
            postId: "post456",
            postName: "หนังสั้นเพื่อการประกวด",
            productionProfessionalId: "prof123",
            producerId: "producer789",
            role: "Cinematographer",
            expectation:
              "ต้องการช่างภาพที่มีประสบการณ์ถ่ายทำในสถานที่จริงและมีผลงานที่ได้รับรางวัล",
            description:
              "ดูแลการถ่ายภาพทั้งหมด รวมถึงการเลือกเลนส์และการจัดแสง",
            startDate: "2024-04-10T00:00:00.000Z",
            endDate: "2024-04-30T00:00:00.000Z",
            price: 25000,
            status: "accepted",
          },
          {
            id: "offer3",
            postId: "post789",
            postName: "มิวสิควิดีโอเพลงใหม่",
            productionProfessionalId: "prof456",
            producerId: "producer123",
            role: "Editor",
            expectation:
              "ต้องการผู้ตัดต่อที่เชี่ยวชาญด้านเทคนิคพิเศษและการตัดต่อให้เข้ากับจังหวะเพลง",
            description:
              "รับผิดชอบการตัดต่อวิดีโอและการใส่เอฟเฟกต์พิเศษให้กับมิวสิควิดีโอ",
            startDate: "2024-05-01T00:00:00.000Z",
            endDate: "2024-05-15T00:00:00.000Z",
            price: 15000,
            status: "negotiating",
          },
          {
            id: "offer4",
            postId: "post101",
            postName: "สารคดีท่องเที่ยวเชิงวัฒนธรรม",
            productionProfessionalId: "prof789",
            producerId: "producer456",
            role: "Sound Designer",
            expectation:
              "ต้องการผู้ออกแบบเสียงที่มีความเข้าใจในวัฒนธรรมท้องถิ่นและสามารถบันทึกเสียงภาคสนามได้ดี",
            description:
              "ดูแลการบันทึกเสียงและการมิกซ์เสียงทั้งหมดสำหรับสารคดี",
            startDate: "2024-06-01T00:00:00.000Z",
            endDate: "2024-06-30T00:00:00.000Z",
            price: 20000,
            status: "rejected",
          },
        ];

        setOffers(mockOffers);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.token) {
      handleFetch();
    } else if (status !== "loading") {
      // Show mock data if not authenticated or loading finished
      setTimeout(() => {
        const mockOffers = [
          {
            id: "offer1",
            postId: "post123",
            postName: "โฆษณาผลิตภัณฑ์เสริมอาหาร",
            productionProfessionalId: "prof456",
            producerId: "producer789",
            role: "Director",
            expectation: "ต้องการผู้กำกับที่มีประสบการณ์ด้านโฆษณาอาหารเสริม",
            description:
              "รับผิดชอบการกำกับทีมงานและควบคุมการถ่ายทำให้เป็นไปตามวิสัยทัศน์",
            startDate: "2024-04-01T00:00:00.000Z",
            endDate: "2024-04-15T00:00:00.000Z",
            price: 30000,
            status: "pending",
          },
          {
            id: "offer2",
            postId: "post456",
            postName: "หนังสั้นเพื่อการประกวด",
            productionProfessionalId: "prof123",
            producerId: "producer789",
            role: "Cinematographer",
            expectation:
              "ต้องการช่างภาพที่มีประสบการณ์ถ่ายทำในสถานที่จริงและมีผลงานที่ได้รับรางวัล",
            description:
              "ดูแลการถ่ายภาพทั้งหมด รวมถึงการเลือกเลนส์และการจัดแสง",
            startDate: "2024-04-10T00:00:00.000Z",
            endDate: "2024-04-30T00:00:00.000Z",
            price: 25000,
            status: "accepted",
          },
          {
            id: "offer3",
            postId: "post789",
            postName: "มิวสิควิดีโอเพลงใหม่",
            productionProfessionalId: "prof456",
            producerId: "producer123",
            role: "Editor",
            expectation:
              "ต้องการผู้ตัดต่อที่เชี่ยวชาญด้านเทคนิคพิเศษและการตัดต่อให้เข้ากับจังหวะเพลง",
            description:
              "รับผิดชอบการตัดต่อวิดีโอและการใส่เอฟเฟกต์พิเศษให้กับมิวสิควิดีโอ",
            startDate: "2024-05-01T00:00:00.000Z",
            endDate: "2024-05-15T00:00:00.000Z",
            price: 15000,
            status: "negotiating",
          },
        ];
        setOffers(mockOffers);
        setIsLoading(false);
      }, 1000); // Simulate loading for 1 second
    }
  }, [session, status]);

  const handleOfferClick = (offerId: string) => {
    router.push(`/my-offers/${offerId}`);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-mainyellow text-dark";
      case "accepted":
        return "bg-maingreen-light text-white";
      case "negotiating":
        return "bg-mainblue-light text-white";
      case "rejected":
        return "bg-mainred-light text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <main className="min-h-screen flex flex-col gap-5 pb-10">
      <div className="mt-20 gap-5 flex flex-col px-4 md:px-8">
        <span className="text-4xl md:text-5xl font-bold text-center">
          My Offers
        </span>

        <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 bg-gray-200 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : offers && offers.length > 0 ? (
            // Display offers
            <div className="flex flex-col gap-5">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleOfferClick(offer.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-mainblue">
                      {offer.postName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(offer.status)}`}
                    >
                      {offer.status.charAt(0).toUpperCase() +
                        offer.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-gray-600">
                    <span className="font-medium mr-2">Role:</span> {offer.role}
                  </div>
                  <p className="mt-2 text-gray-700 line-clamp-2">
                    {offer.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {new Date(offer.startDate).toLocaleDateString("th-TH")} -{" "}
                      {new Date(offer.endDate).toLocaleDateString("th-TH")}
                    </div>
                    <div className="font-bold text-mainblue">
                      ฿{offer.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No offers state
            <div className="text-center py-8">
              <p className="text-gray-500">คุณยังไม่มีข้อเสนอ</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
