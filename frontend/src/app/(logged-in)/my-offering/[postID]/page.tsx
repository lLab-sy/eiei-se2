// frontend/src/app/(logged-in)/my-offering/[postID]/page.tsx

"use client";
import { historyStateInterface } from "@/components/HistoryProduction";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostData } from "../../../../../interface";

// นำเข้า mock data
import { mockOfferHistory, mockPostDetail } from "@/mock/mockData";

// นำเข้า components ที่แยกออกมา
import HistoryProductionContent from "@/components/HistoryProductionContent";
import RoleDropdown from "@/components/RoleDropdown";
import ProfessionalSelector from "@/components/ProfessionalSelector";
import OfferHistory from "@/components/OfferHistory";
import ComparisonView from "@/components/ComparisonView";
import PostDetail from "@/components/PostDetail";

// สร้าง interface สำหรับข้อมูลของ Production Professional
interface ProfessionalData {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// สร้าง interface สำหรับข้อเสนอที่แบ่งตามบทบาท
interface RoleBasedOffer {
  role: string;
  professionals: {
    professionalId: string;
    professionalName: string;
    professionalAvatar: string;
    offerId: string;
    price: number;
    reason: string;
    status: string;
    date: string;
    isLatestOffer: boolean; // ใช้ระบุว่าเป็นข้อเสนอล่าสุดหรือไม่
  }[];
}

export default function OfferPostContent() {
  const user: any = useSelector<RootState>((state) => state.user.user);
  const { data: session } = useSession();
  const { postID }: { postID: string } = useParams();
  const router = useRouter();
  const [offerArray, setOfferArray] = useState<Array<historyStateInterface>>(
    [],
  );
  const [userRole, setUserRole] = useState<
    "producer" | "production professional"
  >("producer");
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const [viewMode, setViewMode] = useState<"individual" | "comparison">(
    "individual",
  );
  const [roleBasedOffers, setRoleBasedOffers] = useState<RoleBasedOffer[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data สำหรับรายชื่อ Production Professional ที่ส่งข้อเสนอมา
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([
    {
      id: "prof1",
      name: "สมชาย ใจดี",
      role: "ผู้กำกับ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    {
      id: "prof2",
      name: "สมหญิง รักดี",
      role: "ช่างภาพ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    },
    {
      id: "prof3",
      name: "มานะ อดทน",
      role: "นักแสดงนำชาย",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mana",
    },
    {
      id: "prof4",
      name: "วีรชัย สุดเก่ง",
      role: "ผู้กำกับ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Weerachai",
    },
  ]);

  // Mock data สำหรับข้อเสนอของ Professional ที่ login เข้ามา
  const myProfessionalOffers = [
    {
      _id: "myoffer1",
      roleName: "ผู้กำกับ",
      reason:
        "ผมมีประสบการณ์ทำหนังสั้นมา 3 ปี เคยได้รับรางวัลจากเทศกาลหนังสั้น",
      postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
      currentWage: 20000,
      offeredBy: false, // false = Professional เป็นคนเสนอ
      createdAt: "2025-03-16T14:20:00.000Z",
      status: "candidate",
    },
    {
      _id: "myoffer2",
      roleName: "ผู้กำกับ",
      reason: "ขอบคุณสำหรับการตอบรับข้อเสนอ ผมจะทำงานอย่างเต็มที่ครับ",
      postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
      currentWage: 18000,
      offeredBy: false,
      createdAt: "2025-03-18T10:30:00.000Z",
      status: "in-progress",
    },
  ];

  // Mock data สำหรับข้อเสนอของแต่ละ Professional
  const mockProfessionalOffers = {
    prof1: [
      {
        _id: "offer1",
        roleName: "ผู้กำกับ",
        reason: "ต้องการผู้กำกับที่มีประสบการณ์ทำงานหนังสั้นอย่างน้อย 2 ปี",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 15000,
        offeredBy: true, // true = Producer, false = Professional
        createdAt: "2025-03-15T10:30:00.000Z",
        status: "candidate",
      },
      {
        _id: "offer2",
        roleName: "ผู้กำกับ",
        reason:
          "ผมมีประสบการณ์ทำหนังสั้นมา 3 ปี เคยได้รับรางวัลจากเทศกาลหนังสั้น",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 20000,
        offeredBy: false,
        createdAt: "2025-03-16T14:20:00.000Z",
        status: "candidate",
      },
      {
        _id: "offer3",
        roleName: "ผู้กำกับ",
        reason: "ขอเสนอที่ 18,000 บาท เนื่องจากงบประมาณของโปรเจคมีจำกัด",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 18000,
        offeredBy: true,
        createdAt: "2025-03-17T09:15:00.000Z",
        status: "in-progress",
      },
    ],
    prof2: [
      {
        _id: "offer4",
        roleName: "ช่างภาพ",
        reason:
          "ต้องการช่างภาพที่มีอุปกรณ์ส่วนตัวพร้อมถ่ายทำ สไตล์การถ่ายภาพแบบ cinematic",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 12000,
        offeredBy: true,
        createdAt: "2025-03-15T11:45:00.000Z",
        status: "candidate",
      },
      {
        _id: "offer5",
        roleName: "ช่างภาพ",
        reason:
          "ดิฉันมีประสบการณ์ถ่ายหนังสั้นมากกว่า 5 ปี และมีอุปกรณ์ส่วนตัวครบครัน",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 15000,
        offeredBy: false,
        createdAt: "2025-03-16T13:20:00.000Z",
        status: "candidate",
      },
    ],
    prof3: [
      {
        _id: "offer6",
        roleName: "นักแสดงนำชาย",
        reason:
          "ต้องการนักแสดงชายอายุระหว่าง 25-35 ปี สามารถแสดงอารมณ์หลากหลาย",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 8000,
        offeredBy: true,
        createdAt: "2025-03-15T12:30:00.000Z",
        status: "candidate",
      },
      {
        _id: "offer7",
        roleName: "นักแสดงนำชาย",
        reason:
          "ขอเสนอค่าตัว 10,000 บาท เนื่องจากมีประสบการณ์การแสดงมามากกว่า 4 ปี",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 10000,
        offeredBy: false,
        createdAt: "2025-03-17T10:30:00.000Z",
        status: "candidate",
      },
    ],
    prof4: [
      {
        _id: "offer8",
        roleName: "ผู้กำกับ",
        reason: "ผมมีประสบการณ์ในการกำกับภาพยนตร์โฆษณาและหนังสั้นมากกว่า 5 ปี",
        postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
        currentWage: 25000,
        offeredBy: false,
        createdAt: "2025-03-15T16:45:00.000Z",
        status: "candidate",
      },
    ],
  };

  // หาว่าข้อเสนอไหนเป็นข้อเสนอล่าสุดสำหรับคน/บทบาทนั้นๆ
  const getLatestOffers = () => {
    // จัดกลุ่มข้อเสนอตามบทบาท
    const roles: { [key: string]: RoleBasedOffer } = {};

    // สร้าง map เพื่อเก็บข้อเสนอล่าสุดของแต่ละคน (professional+role)
    const latestOffers: { [key: string]: string } = {};

    // วนลูปผ่านแต่ละ Professional
    Object.keys(mockProfessionalOffers).forEach((profId) => {
      const prof = professionals.find((p) => p.id === profId);
      if (!prof) return;

      // เก็บข้อเสนอของแต่ละคนตามบทบาท
      const profOffersByRole: { [role: string]: historyStateInterface[] } = {};

      // วนลูปผ่านข้อเสนอของแต่ละคน
      mockProfessionalOffers[
        profId as keyof typeof mockProfessionalOffers
      ].forEach((offer) => {
        const roleName = offer.roleName;

        if (!profOffersByRole[roleName]) {
          profOffersByRole[roleName] = [];
        }

        profOffersByRole[roleName].push(offer);
      });

      // หาข้อเสนอล่าสุดของแต่ละบทบาท
      Object.keys(profOffersByRole).forEach((roleName) => {
        // เรียงลำดับข้อเสนอตามวันที่ (ล่าสุดก่อน)
        const sortedOffers = profOffersByRole[roleName].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        // หาข้อเสนอล่าสุดที่มาจาก Professional (ไม่ใช่ Producer)
        const latestProfOffer = sortedOffers.find((o) => !o.offeredBy);

        if (latestProfOffer) {
          // เก็บ ID ของข้อเสนอล่าสุด
          const offerKey = `${profId}-${roleName}`;
          latestOffers[offerKey] = latestProfOffer._id;

          if (!roles[roleName]) {
            roles[roleName] = {
              role: roleName,
              professionals: [],
            };
          }

          const offerDate = new Date(latestProfOffer.createdAt);
          const formattedDate = offerDate.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          roles[roleName].professionals.push({
            professionalId: profId,
            professionalName: prof.name,
            professionalAvatar: prof.avatar,
            offerId: latestProfOffer._id,
            price: latestProfOffer.currentWage,
            reason: latestProfOffer.reason,
            status: latestProfOffer.status,
            date: formattedDate,
            isLatestOffer: true, // ข้อเสนอล่าสุดทั้งหมด
          });
        }
      });
    });

    // จัดการข้อมูลสำหรับการแสดงรายการข้อเสนอแต่ละคน
    Object.keys(mockProfessionalOffers).forEach((profId) => {
      const offers =
        mockProfessionalOffers[profId as keyof typeof mockProfessionalOffers];
      const latestOfferIds: string[] = [];

      // ค้นหาข้อเสนอล่าสุดของคนนี้
      Object.keys(latestOffers).forEach((key) => {
        if (key.startsWith(`${profId}-`)) {
          latestOfferIds.push(latestOffers[key]);
        }
      });

      // อัพเดทข้อมูลว่าข้อเสนอไหนเป็นข้อเสนอล่าสุด
      offers.forEach((offer) => {
        offer.isLatestOffer = latestOfferIds.includes(offer._id);
      });
    });

    // แปลงเป็น array สำหรับการแสดงผล
    return Object.values(roles);
  };

  // สร้างข้อมูลเปรียบเทียบตามบทบาท
  useEffect(() => {
    if (userRole === "producer") {
      const roleOffers = getLatestOffers();
      setRoleBasedOffers(roleOffers);

      // ดึงรายการบทบาทที่มีอยู่
      const roles = roleOffers.map((offer) => offer.role);
      setAvailableRoles(roles);

      // ตั้งค่าบทบาทเริ่มต้น (ถ้ามี)
      if (roles.length > 0 && !selectedRole) {
        setSelectedRole(roles[0]);
      }
    }
    setLoading(false);
  }, [userRole, professionals]);
  console.log(userRole, session?.user?.role);

  const handleBack = () => {
    router.push("/my-offering");
  };

  const userId = user?._id ?? "";

  useEffect(() => {
    // สมมติว่าเราดึงบทบาทของผู้ใช้จาก session หรือ Redux store
    const role = session?.user?.role || "producer"; // สมมติว่าเป็น producer ในตัวอย่างนี้
    setUserRole(role as "producer" | "production professional");

    if (role === "producer") {
      // เลือก professional คนแรกโดยค่าเริ่มต้น (ถ้ามี)
      if (professionals.length > 0) {
        setSelectedProfessionalId(professionals[0].id);
        // ดึงข้อเสนอของ professional คนแรก
        setOfferArray(
          mockProfessionalOffers[
            professionals[0].id as keyof typeof mockProfessionalOffers
          ] || [],
        );
      }
    } else if (role === "production professional") {
      // ถ้าเป็น professional ให้ใช้ข้อเสนอของ professional คนนั้น
      setOfferArray(myProfessionalOffers);
    }
  }, [session]);

  const [postState, setPostState] = useState<PostData | null>(null);

  useEffect(() => {
    // ใช้ mock data แทนการเรียก API จริง
    setPostState(mockPostDetail);
  }, []);

  // เมื่อเลือก professional
  const handleSelectProfessional = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);

    // ดึงข้อเสนอของ professional ที่เลือก
    setOfferArray(
      mockProfessionalOffers[
        professionalId as keyof typeof mockProfessionalOffers
      ] || [],
    );
  };

  // เมื่อเลือกบทบาท
  const handleSelectRole = (role: string) => {
    setSelectedRole(role);

    // รีเซ็ต professional ที่เลือกเมื่อเปลี่ยน role
    const profsInRole = getProfessionalsByRole(role);
    if (profsInRole.length > 0) {
      setSelectedProfessionalId(profsInRole[0].id);
      setOfferArray(
        mockProfessionalOffers[
          profsInRole[0].id as keyof typeof mockProfessionalOffers
        ] || [],
      );
    } else {
      setSelectedProfessionalId(null);
      setOfferArray([]);
    }
  };

  // ดึงเฉพาะ professional ตามบทบาทที่เลือก
  const getProfessionalsByRole = (role: string) => {
    return professionals.filter((prof) => {
      // ตรวจสอบว่า professional นี้มีข้อเสนอในบทบาทที่เลือกหรือไม่
      const offers =
        mockProfessionalOffers[
          prof.id as keyof typeof mockProfessionalOffers
        ] || [];
      return offers.some((offer) => offer.roleName === role);
    });
  };

  const offerDateStart = new Date(postState?.startDate ?? "");
  const startDate = offerDateStart.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const offerDateEnd = new Date(postState?.endDate ?? "");
  const endDate = offerDateEnd.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // สำหรับ Producer - การตอบรับหรือปฏิเสธข้อเสนอ
  const handleAcceptOffer = (offerId: string) => {
    console.log(`ตอบรับข้อเสนอ ${offerId}`);
    // ทำการตอบรับข้อเสนอจริงๆ ควรเรียก API ที่เหมาะสม

    // อัพเดทข้อมูลของข้อเสนอในโหมดดูรายคน
    setOfferArray(
      offerArray.map((offer) =>
        offer._id === offerId ? { ...offer, status: "in-progress" } : offer,
      ),
    );

    // อัพเดทข้อมูลของข้อเสนอในโหมดเปรียบเทียบ
    setRoleBasedOffers(
      roleBasedOffers.map((roleOffer) => ({
        ...roleOffer,
        professionals: roleOffer.professionals.map((prof) =>
          prof.offerId === offerId ? { ...prof, status: "in-progress" } : prof,
        ),
      })),
    );
  };

  const handleRejectOffer = (offerId: string) => {
    console.log(`ปฏิเสธข้อเสนอ ${offerId}`);
    // ทำการปฏิเสธข้อเสนอจริงๆ ควรเรียก API ที่เหมาะสม

    // อัพเดทข้อมูลของข้อเสนอในโหมดดูรายคน
    setOfferArray(
      offerArray.map((offer) =>
        offer._id === offerId ? { ...offer, status: "reject" } : offer,
      ),
    );

    // อัพเดทข้อมูลของข้อเสนอในโหมดเปรียบเทียบ
    setRoleBasedOffers(
      roleBasedOffers.map((roleOffer) => ({
        ...roleOffer,
        professionals: roleOffer.professionals.map((prof) =>
          prof.offerId === offerId ? { ...prof, status: "reject" } : prof,
        ),
      })),
    );
  };

  // สำหรับ Professional - การส่งข้อเสนอ
  const handleSendOffer = () => {
    router.push(`/create-offer/${postID}`);
    // สมมติว่ามีเส้นทางสำหรับการสร้างข้อเสนอ
  };

  // ฟังก์ชั่นสลับโหมดการดู
  const toggleViewMode = () => {
    setViewMode(viewMode === "individual" ? "comparison" : "individual");
  };

  // ตรวจสอบว่าข้อเสนอนี้เป็นข้อเสนอล่าสุดหรือไม่
  const isLatestOffer = (offer: historyStateInterface) => {
    return offer.isLatestOffer === true;
  };

  if (loading) {
    return (
      <div className="mt-20 flex justify-center items-center">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <main className="flex flex-col h-[100vh] gap-3 mb-5 relative">
      <div className="relative mt-20 flex flex-row gap-5 item-baseline w-full h-full">
        <div className="w-[50%] flex justify-center items-center h-[800px]">
          {/* ใช้ PostDetail component */}
          <PostDetail
            postState={postState}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="relative w-[44%] shadow-md h-[720px] rounded-lg">
          {userRole === "producer" && (
            <div className="w-full">
              <div className="flex flex-col p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold mb-2">ผู้สมัคร</h3>
                  <button
                    onClick={toggleViewMode}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {viewMode === "individual"
                      ? "ดูแบบเปรียบเทียบ"
                      : "ดูแบบรายคน"}
                  </button>
                </div>

                {viewMode === "individual" && (
                  <div className="flex flex-col gap-3">
                    {/* ใช้ RoleDropdown component */}
                    <RoleDropdown
                      selectedRole={selectedRole}
                      availableRoles={availableRoles}
                      onSelectRole={handleSelectRole}
                    />

                    {/* แสดงรายชื่อ Professional ตาม Role ที่เลือก */}
                    {selectedRole && (
                      <ProfessionalSelector
                        professionals={getProfessionalsByRole(selectedRole)}
                        selectedProfessionalId={selectedProfessionalId}
                        onSelect={handleSelectProfessional}
                      />
                    )}
                  </div>
                )}
              </div>

              {viewMode === "individual" && selectedProfessionalId && (
                <OfferHistory
                  offers={
                    mockProfessionalOffers[
                      selectedProfessionalId as keyof typeof mockProfessionalOffers
                    ] || []
                  }
                  professionalName={
                    professionals.find((p) => p.id === selectedProfessionalId)
                      ?.name || ""
                  }
                  userRole={userRole}
                  isLatestOffer={isLatestOffer}
                  onAccept={handleAcceptOffer}
                  onReject={handleRejectOffer}
                />
              )}

              {viewMode === "comparison" && (
                <ComparisonView
                  roleBasedOffers={roleBasedOffers}
                  onAccept={handleAcceptOffer}
                  onReject={handleRejectOffer}
                />
              )}
            </div>
          )}

          {userRole === "production professional" && (
            <div className="mt-4 p-4">
              <span className="text-2xl font-bold">ข้อเสนอของฉัน</span>
              {offerArray.length > 0 ? (
                <div
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  className="overflow-scroll flex flex-col w-[100%] max-h-[640px] items-center flex-wrap gap-5 mt-4"
                >
                  {offerArray.map((offer, index) => (
                    <div key={index} className="mt-4 w-[90%] relative">
                      <HistoryProductionContent data={offer} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-10 text-center text-gray-500">
                  ยังไม่มีข้อเสนอ
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex justify-end right-[80px] absolute bottom-[250px]">
          {/* <div className="ml-[5%]">
            {userRole === "production professional" && (
              <Button
                onClick={handleSendOffer}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                ส่งข้อเสนอ
              </Button>
            )}
          </div> */}

          <Button
            onClick={handleBack}
            className="w-[100px] bg-red-500 hover:bg-red-600 text-white"
          >
            กลับ
          </Button>
        </div>
      </div>
    </main>
  );
}