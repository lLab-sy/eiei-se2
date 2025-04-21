"use client";
import { historyStateInterface } from "@/components/HistoryProduction";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  OfferData,
  OfferHistoryResponseData,
  PostData,
} from "../../../../../interface";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// นำเข้า mock data
import { mockOfferHistory, mockPostDetail } from "@/mock/mockData";

// นำเข้า components ที่แยกออกมา
import HistoryProductionContent from "@/components/HistoryProductionContent";
import RoleDropdown from "@/components/RoleDropdown";
import ProfessionalSelector from "@/components/ProfessionalSelector";
import OfferHistory from "@/components/OfferHistory";
import ComparisonView from "@/components/ComparisonView";
import PostDetail from "@/components/PostDetail";
import getPostById from "@/libs/getPostById";
import getPrudcerOffers from "@/libs/getProducerOffers";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox, CircularProgress, Rating } from "@mui/material";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MyOfferingProducer from "@/components/MyOfferingProducer";
import MyPostDetail from "@/components/MyPostDetail";
import ProductionWorkingContent from "@/components/ProducerWorkingContent";
import ProducerWorkingContent from "@/components/ProducerWorkingContent";
import { Console } from "console";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

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
interface reviewUserDataInterface {
  comment: string;
  createdAt: string;
  postID: string;
  ratingScore: number;
  _id: string;
}
enum StatusChangeType {
  Candidate = "candidate",
  Reject = "reject",
}

interface userReturn {
  firstName: string;
  middleName: string;
  lastName: string;
  rating: Array<reviewUserDataInterface>;
  profileImage: string;
  username : string;
  role : string;
}

const ConfirmOffer = ({
  offer,
  postID,
  token,
  setOfferArray,
  setOfferStatus,
}: {
  setOfferStatus: Function;
  setOfferArray: Function;
  token: string | undefined;
  postID: string;
  offer: historyStateInterface;
}) => {
  const { toast } = useToast();
  token = token ?? "";
  const offerDate = new Date(offer.createdAt);
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/participant-status`;
  const { data: session } = useSession();

  const userId = session?.user?.id ?? "";
  const handleStatusChange = async (status: StatusChangeType) => {
    const body = {
      postID: postID,
      participantID: offer.participantID,
      statusToChange: status,
    };

    const res = await axios.patch(apiUrl, body, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    return res;
  };
  const handleFetch = async (userId: string) => {
    const query = `?postId=${postID}&userId=${userId}&limit=10&page=1`;
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/getOffers${query}`;
    const res = await axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
      },
    });
    return res;
  };

  const displayDate = offerDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const [open, setOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(0);
  const [canCanfirm, setCanConfirm] = useState(false);
  const handleRejectOffer = () => {
    setIsChanged(1);
    setTextState("");
    setCanConfirm(false);
    setCheckboxState(false);
    // setTimeout(() => {}, 1000)
    // setIsChanged(false)
  };
  const handleConfirmOffer = () => {
    if (isChanged == 0) {
      setIsChanged(2);
    }
  };
  const [loading, setLoading] = useState(false);
  const handleClickConfirmOffer = async (isConfirm: boolean) => {
    // setTextState("")
    // alert(1)
    setLoading(true);
    const res = await handleStatusChange(
      isConfirm ? StatusChangeType.Candidate : StatusChangeType.Reject,
    );
    const updateOfferRes = await handleFetch(userId);
    const offerArray: Array<historyStateInterface> =
      updateOfferRes?.data?.data?.data;
    if (res?.data?.status !== "success") {
      toast({
        title: `${isConfirm ? "Confirm" : "Reject"} Offer`,
        description: `Unable to ${isConfirm ? "confirm" : "reject"} this offer`,
        variant: "destructive",
      });
      return;
    }
    setOfferArray(offerArray);
    if (offerArray.length > 0) {
      setOfferStatus(offerArray[0]?.status ?? "");
    }
    setOpen(false);
    setTextState("");
    setCheckboxState(false);
    setLoading(false);
    toast({
      title: `${isConfirm ? "Confirm" : "Reject"} Offer`,
      description: `${isConfirm ? "Confirm" : "Reject"} this offer successfully`,
    });
  };
  const [textState, setTextState] = useState("");
  // console.log('textState', textState)
  const [profileImageState, setProfileImageState] = useState("");
  const [reviewState, setReviewState] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const handleTriggerDialog = async () => {
    const user = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/users/${offer.participantID}`,
    );
    setTextState("");
    setCanConfirm(false);
    setIsChanged(0);
    setCheckboxState(false);
    const data: userReturn = user.data.data;
    console.log('data', data)
    setProfileImageState(data?.profileImage ?? "");
    setName(data?.username);
    const count = data.rating.length;
    let sumRating = 0;
    for (const object of data.rating) {
      sumRating += object.ratingScore;
    }
    setRatingCount(count);
    setReviewState(
      sumRating == 0 || count == 0 ? 0 : Math.round(sumRating / count),
    );
  };
  const router = useRouter();
  const handleCounterOffer = (postID: string) => {
    if (isChanged == 3) {
      setOpen(false);
      router.push(`/create-offer/${postID}`);
    } else setIsChanged(3);
  };

  const [checkboxState, setCheckboxState] = useState(false);
  const offerRole =
    offer.offeredBy == 1 ? "producer" : "production professional";
  const canOffer =
    (offer.offeredBy == 1 ? "producer" : "production professional") !==
    session?.user.role;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={handleTriggerDialog}
          className="mt-4 pb-1 w-[90%] relative"
        >
          <HistoryProductionContent data={offer} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isChanged == 1 ? "Reject Offer" : "Confirm Offer"}:{" "}
            {offer.postName}
          </DialogTitle>
          <DialogDescription>Role: {offer.roleName}</DialogDescription>
        </DialogHeader>
        {isChanged > 0 ? (
          <div className="gap-3 flex flex-col">
            <span>
              {isChanged == 1
                ? "If you reject this offer, you won’t be able to make another offer on this post in the future. "
                : ""}
            </span>
            <span
              className={`${isChanged == 1 ? "text-mainred" : isChanged == 3 ? "text-black" : "text-black"}`}
            >
              {" "}
              {isChanged == 1
                ? "Please type 'Reject Offer' to decline."
                : isChanged == 3
                  ? "You are about to be redirected to the Create Offer page. Are you sure?"
                  : "Are you sure to accept this offer."}
            </span>
            {isChanged == 1 ? (
              <Input
                value={textState}
                onChange={(e) => {
                  setTextState(e.target.value);
                  // console.log("e", e.target.value)
                  if (
                    e.target.value ==
                    (isChanged == 1 ? "Reject Offer" : "Confirm Offer")
                  ) {
                    setCanConfirm(true);
                  } else {
                    setCanConfirm(false);
                  }
                }}
              />
            ) : isChanged == 3 ? (
              <div></div>
            ) : (
              <div>
                <Checkbox
                  value={checkboxState}
                  onChange={(e) => setCheckboxState(e.target.checked)}
                />
                <Label>Confirmed</Label>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        <div className={`${isChanged > 0 ? "hidden" : ""}`}>
          <div className={`flex flex-row gap-3`}>
            <Avatar className="border flex justify-center items-center">
              {/* {
                isLoading && profileImageState &&
                <CircularProgress size={20}/>

              }
              {
                (profileImageState) ? 
                <AvatarImage onLoad={() => setIsLoading(false)} onError={() => setIsLoading(false)} src={profileImageState ?? "/"}/>
                      :
                <User />
              } */}
              <User />
            </Avatar>
            <div className="flex flex-col">
              <span>{`From: ${name} `}</span>
              <div className="flex">
                <Rating value={reviewState} readOnly />
                <span>{ratingCount} (review)</span>
              </div>
            </div>
          </div>
          <Separator className="bg-black my-2" />
          <div>
            <span className="text-xl font-bold">Offer Detail</span>
            <div className="flex justify-between">
              <span>Offered Price:</span>
              <span>{`${offer.currentWage} THB`}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span>{displayDate}</span>
            </div>
            <div className="flex flex-col">
              <span>Description</span>
              <div className="w-[100%] flex justify-center items-center bg-slate-50 h-[300px] rounded-xl">
                <span className="w-[80%] h-[80%] text-wrap">{offer.reason}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-center">
            {offer.status === "in-progress" ? (
              <div className="flex justify-around w-full">
                <Button
                  onClick={
                    isChanged > 0
                      ? () => {
                          setIsChanged(0);
                          setCanConfirm(false);
                          setTextState("");
                          setCheckboxState(false);
                        }
                      : handleRejectOffer
                  }
                  className="w-[25%] rounded-lg bg-mainred hover:bg-mainred-light"
                >
                  {isChanged > 0 ? "No" : "Reject Offer"}
                </Button>
                <Button
                  onClick={() => {
                    handleCounterOffer(postID);
                  }}
                  className={`${isChanged == 3 ? "hidden" : ""}`}
                >
                  Counter Offer
                </Button>
                <Button
                  onClick={
                    isChanged > 0
                      ? () => {
                          isChanged == 2
                            ? handleClickConfirmOffer(true)
                            : isChanged == 3
                              ? handleCounterOffer(postID)
                              : handleClickConfirmOffer(false);
                        }
                      : handleConfirmOffer
                  }
                  className="w-[30%] rounded-lg bg-maingreen text-white hover:bg-maingreen-light"
                  disabled={
                    ((canCanfirm || checkboxState || isChanged == 3) &&
                      isChanged > 0) ||
                    (isChanged == 0 && canOffer)
                      ? false
                      : true
                  }
                >
                  {isChanged ? "Yes" : "Confirm Offer"}
                </Button>
              </div>
            ) : (
              <span className="text-lg">
                You have successfully{" "}
                <span
                  className={`${offer.status === "reject" ? "text-mainred-light" : "text-maingreen-light"}`}
                >
                  {offer.status === "reject" ? "rejected" : "confirmed"}
                </span>{" "}
                this offer.
              </span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

//         <p
//             className={`text-sm w-full m-auto text-end font-semibold ${
//                 post.postStatus === "created" ? "text-mainblue-light" :
//                 post.postStatus === "waiting" ? "text-mainblue-dark" :
//                 post.postStatus === "in-progress" ? "text-mainyellow" :
//                 post.postStatus === "success" ? "text-green-500" : "text-gray-500"
//             }`}
//             >
//             Status: {post.postStatus}
//         </p>

//         <Carousel className="col-span-2 w-full h-[40%] flex-auto">
//                 <CarouselContent>
//                     {post?.postImageDisplay.map((image, index) => (
//                     <CarouselItem key={index}>
//                         <Card className="relative w-full aspect-video">
//                             <Image
//                             src={image.imageURL}
//                             alt={`Project Image ${index + 1}`}
//                             fill
//                             className="object-cover rounded-lg w-full h-full"
//                             />
//                         </Card>
//                     </CarouselItem>
//                     ))}
//                 </CarouselContent>
//                 {/* <CarouselPrevious className="left-2" /> */}
//                 {/* <CarouselNext className="right-2" /> */}
//         </Carousel>

//         <Separator className="mt-5 col-span-2 h-1" />
//         <div className="col-span-2 p-6 mt-4 rounded-lg h-[20%] ">
//           <span className="text-xl font-bold ">Post Description</span>
//           <div className="mt-2 w-full border max-h-[150px] rounded-xl bg-slate-50 overflow-auto p-3">
//             {post.postDescription}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
export default function OfferPostContent() {
  const user: any = useSelector<RootState>((state) => state.user.user);

  const { data: session } = useSession();
  const { postID }: { postID: string } = useParams();
  const router = useRouter();
  const [offerArray, setOfferArray] = useState<Array<historyStateInterface>>(
    [],
  );
  const [userRole, setUserRole] = useState<
    "producer" | "production professional" | ""
  >("");
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

        // profOffersByRole[roleName].push(offer);
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
      // offers.forEach((offer) => {
      //   offer.isLatestOffer = latestOfferIds.includes(offer._id);
      // });
    });

    // แปลงเป็น array สำหรับการแสดงผล
    return Object.values(roles);
  };

  //------------------------------------------------------------------------------------

  const token = session?.user.token;
  const userID = session?.user.id;
  const [producerOffers, setProducerOffers] = useState<
    OfferHistoryResponseData[] | null
  >(null);
  const [selectedOfferProducer, setSelectedOfferProducer] =
    useState<OfferHistoryResponseData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        let response2;
        if (userRole === "producer") {
          response2 = await getPostById(postID, token ?? "");
          setPostState(response2);
          response = await getPrudcerOffers(token ?? ""); // ดึงโพสต์ของ producer
          setProducerOffers(response);
          // console.log("PRODUCER BY",response)
        } else if (userRole === "production professional") {
          const handleFetch = async (postID: string) => {
            const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/${postID}`;
            const res = await axios.get(apiUrl);
            setPostState(res?.data?.data ?? {});
            // console.log("postImageDisplay", res?.data?.data?.postImageDisplay?.[0])
            const postImageDisplay = res?.data?.data?.postImageDisplay?.[0];
            // console.log('postImageDisplay', postImageDisplay)
            // console.log('imageDisplayUrl', postImageDisplay.imageUrl)
            // setPostImageState(res?.data?.data?.postImageDisplay?.[0].imageURL ?? "")
          };
          handleFetch(postID);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userID, userRole]);
  //*********************************** */

  //API Connection
  //  useEffect(() => {
  //       const fetchData = async () => {
  //         try {
  //           let response;
  //           if (userRole === "producer") {
  //             response = await getPostById(postID,token ?? "")
  //             setPostState(response)
  //           } else if (userRole === "production professional") {
  //             // response = await getPostById(pid, token); // ดึงโพสต์ตาม pid
  //           }
  //           // console.log(response,"OHNPPPPPPPPPPPPPPPPPPPPp")
  //           }
  //         catch (err) {
  //           setError("Failed to load posts. Please try again later.");
  //         }
  //       };
  //      fetchData();
  //     }, []); // ใช้ pid และ token ใน dependency array

  //------------------------------------------------------------------------------------

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
  // console.log(userRole, session?.user?.role);

  const handleBack = () => {
    router.push("/my-offering");
  };

  const userId = user?._id ?? "";

  useEffect(() => {
    // สมมติว่าเราดึงบทบาทของผู้ใช้จาก session หรือ Redux store

    const role = session?.user?.role; // สมมติว่าเป็น producer ในตัวอย่างนี้

    setUserRole(role as "producer" | "production professional");

    if (role === "producer") {
      // เลือก professional คนแรกโดยค่าเริ่มต้น (ถ้ามี)
      if (professionals.length > 0) {
        setSelectedProfessionalId(professionals[0].id);
        // ดึงข้อเสนอของ professional คนแรก
        // setOfferArray(
        //   mockProfessionalOffers[
        //     professionals[0].id as keyof typeof mockProfessionalOffers
        //   ] || [],
        // );
      }
    } else if (role === "production professional") {
      // ถ้าเป็น professional ให้ใช้ข้อเสนอของ professional คนนั้น
      // setOfferArray(myProfessionalOffers);
    }
  }, [session]);

  const [postState, setPostState] = useState<PostData | null>(null);

  // useEffect(() => {
  //   // ใช้ mock data แทนการเรียก API จริง
  //   setPostState(mockPostDetail);
  // }, []);

  // เมื่อเลือก professional
  const handleSelectProfessional = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);

    // ดึงข้อเสนอของ professional ที่เลือก
    // setOfferArray(
    //   mockProfessionalOffers[
    //     professionalId as keyof typeof mockProfessionalOffers
    //   ] || [],
    // );
  };
  const [offerStatus, setOfferStatus] = useState("");
  useEffect(() => {
    const handleFetch = async (userId: string) => {
      const query = `?postId=${postID}&userId=${userId}&limit=10&page=1`;
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/getOffers${query}`;
      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session?.user?.token ?? ""}`,
        },
      });
      const offerArray = res?.data?.data?.data;
      setOfferArray(offerArray);
      if (offerArray.length > 0) {
        setOfferStatus(offerArray[0]?.status ?? "");
      }
    };
    // console.log(userRole)
    if (userRole == "production professional") {
      handleFetch(userId);
    }
  }, [userRole]);
  // console.log('offerArray', offerArray)
  // เมื่อเลือกบทบาท
  const handleSelectRole = (role: string) => {
    setSelectedRole(role);

    // รีเซ็ต professional ที่เลือกเมื่อเปลี่ยน role
    const profsInRole = getProfessionalsByRole(role);
    // if (profsInRole.length > 0) {
    //   setSelectedProfessionalId(profsInRole[0].id);
    //   setOfferArray(
    //     mockProfessionalOffers[
    //       profsInRole[0].id as keyof typeof mockProfessionalOffers
    //     ] || [],
    //   );
    // } else {
    //   setSelectedProfessionalId(null);
    //   setOfferArray([]);
    // }
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
    // console.log(`ตอบรับข้อเสนอ ${offerId}`);
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
    // console.log(`ปฏิเสธข้อเสนอ ${offerId}`);
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
  // const isLatestOffer = (offer: historyStateInterface) => {
  //   return offer.isLatestOffer === true;
  // };

  // if (!producerOffers) {
  //   return (
  //     <div className="mt-20 flex justify-center items-center">
  //       กำลังโหลดข้อมูล...
  //     </div>
  //   );
  // }

  // const handleSelectProducerChange = (selectID: string) => {
  //   const tmpselectedOfferProducer = producerOffers.find(
  //     (eachPerson) => eachPerson._id === selectID,
  //   );
  //   if (
  //     tmpselectedOfferProducer &&
  //     tmpselectedOfferProducer._id !== selectedOfferProducer?._id
  //   ) {
  //     // console.log("ChangPerson", tmpselectedOfferProducer);
  //     setSelectedOfferProducer(tmpselectedOfferProducer);
  //   }
  // };

  return (
    <main className="flex flex-col min-h-screen gap-3 mb-5 relative">
      <div className="relative mt-20 flex flex-row gap-5 item-baseline w-full h-full">
        <div className="w-[50%] flex justify-center items-center h-[800px]">
          {/* ใช้ PostDetail component */}
          {postState && <MyPostDetail post={postState} />}
          {/* {postState && (userRole == 'producer') ? <MyPostDetail post={postState} /> : <ProductionPostDetail post={postState}/>} */}
        </div>

        <div className="relative w-[44%] shadow-md h-[720px] rounded-lg">
          <div className="h-full">
            {postState && userRole === "producer" && (
              <ProducerWorkingContent
                postID={postID}
                postName={postState.postName}
                participants={postState?.participants || []}
                mapRole={postState?.postProjectRolesOut || []}
              />
            )}
            {userRole === "production professional" && (
              <div className="mt-4 h-full">
                <span className="text-2xl px-10 font-bold">My Offering</span>

                {offerArray?.length > 0 ? (
                  <div
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className="overflow-scroll flex w-[100%] justify-center max-h-[640px] items-center flex-wrap gap-5 mt-4"
                  >
                    {offerArray.map((offer, index) => (
                      <ConfirmOffer
                        setOfferArray={setOfferArray}
                        token={token}
                        setOfferStatus={setOfferStatus}
                        postID={postID}
                        offer={{
                          ...offer,
                          status: index == 0 ? offer.status : "reject",
                        }}
                        key={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-10 text-center text-gray-500">
                    You have no offer for now.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-full flex justify-end mt-5">
            <Button
              onClick={handleBack}
              className="w-[100px] bg-red-500 hover:bg-red-600 text-white"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
