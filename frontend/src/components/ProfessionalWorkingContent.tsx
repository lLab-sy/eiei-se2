import ProfessionalWorkingCard from "./ProfessionalWorkingCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import {
  ApproveData,
  Participant,
  ParticipantForRight,
  PostData,
} from "../../interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getPostById from "@/libs/getPostById";
import { LinearProgress } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import getPostParticipantCandidate from "@/libs/getPostParticipantCandidate";
import putApproveWork from "@/libs/putApproveWork";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { CardInterface } from "@/app/(logged-in)/user-profile/profileComponents/ProfileEdit";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CircleCheck } from "lucide-react";
// const StartProjectButton = ({ post, setPost, userRole }: { userRole: string, post: PostData, setPost:Function }) => {
//     const { data: session } = useSession();
//     const token = session?.user.token;
//     console.log("postDataDialog", post);
//     const handleStartProject = async (token: string) => {
//       const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${post.id}/startProject`;
//       setIsLoading(true);
//       await axios.put(
//         apiUrl,
//         {},
//         { withCredentials: true, headers: { Authorization: `Bearer ${token}` } },
//       );
//       const fetchData = async () => {
//           let response;
//           if (userRole === "producer") {
//             response = await getPostById(post.id, session?.user.token ?? ""); // ดึงโพสต์ของ producer
//           } else if (userRole === "production professional") {
//             response = await getPostById(post.id, session?.user.token ?? "");
//           }
//           console.log("respons", response);
//           if (response) {
//             setPost(response);
//           }

//       };
//       await fetchData();
//       setIsLoading(false);
//       setOpen(false);
//     };
//     const [open, setOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             className={`h-[40px] mt-[20px] w-[40%] text-lg self-end ${post?.postStatus === "in-progress" ? "bg-green-500" : ""}`}
//           >
//             {post?.postStatus === "created"
//               ? "Start a project"
//               : post?.postStatus === "in-progress"
//                 ? "Mark as completed"
//                 : ""}
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="">
//           <DialogHeader className="">
//             <DialogTitle className="">Confirm Start the project</DialogTitle>
//           </DialogHeader>
//           {isLoading ? (
//             <CircularProgress />
//           ) : (
//             <div>
//               <span>
//                 Your are about to start the project '{post?.postName ?? ""}'. This
//                 action will initiate the production phase. Do you want to proceed?
//               </span>
//               <div className="flex justify-center mt-5">
//                 <div className="w-[75%] h-[90px] flex bg-mainyellow-light text-mainred justify-center items-center rounded-lg">
//                   <span className="w-[90%] h-[85%]">
//                     Warning: Some required roles for this project are still
//                     unfilled. The following positions.
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="w-full flex justify-around mt-5">
//             <Button
//               disabled={isLoading}
//               onClick={() => setOpen(false)}
//               variant={"destructive"}
//               className="w-[25%] h-[80%] rounded-lg"
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isLoading}
//               onClick={() => handleStartProject(token ?? "")}
//               className="hover:bg-green-500 w-[35%] h-[80%] rounded-lg text-white bg-green-600"
//             >
//               Confirm
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   };
export default function ProfessionalWorkingContent({
  postStatus,
  refreshPost,
}: {
  postStatus: string;
  refreshPost: Function;
}) {
  const cardMapper = {
    Visa: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        enableBackground="new 0 0 512 512"
        xmlSpace="preserve"
        width="80px"
        height="50px"
      >
        <g>
          <g>
            <path
              d="M482.722,103.198c13.854,0,25.126,11.271,25.126,25.126v257.9c0,13.854-11.271,25.126-25.126,25.126H30.99
            c-13.854,0-25.126-11.271-25.126-25.126v-257.9c0-13.854,11.271-25.126,25.126-25.126H482.722 M482.722,98.198H30.99
            c-16.638,0-30.126,13.488-30.126,30.126v257.9c0,16.639,13.488,30.126,30.126,30.126h451.732
            c16.639,0,30.126-13.487,30.126-30.126v-257.9C512.848,111.686,499.36,98.198,482.722,98.198L482.722,98.198z"
              fill="#005098"
            />
          </g>
          <g>
            <polygon
              fill="#005098"
              points="190.88,321.104 212.529,194.022 247.182,194.022 225.494,321.104 190.88,321.104"
            />
            <path
              d="M351.141,197.152c-6.86-2.577-17.617-5.339-31.049-5.339c-34.226,0-58.336,17.234-58.549,41.94
            c-0.193,18.256,17.21,28.451,30.351,34.527c13.489,6.231,18.023,10.204,17.966,15.767c-0.097,8.518-10.775,12.403-20.737,12.403
            c-13.857,0-21.222-1.918-32.599-6.667l-4.458-2.016l-4.864,28.452c8.082,3.546,23.043,6.618,38.587,6.772
            c36.417,0,60.042-17.035,60.313-43.423c0.136-14.447-9.089-25.446-29.071-34.522c-12.113-5.882-19.535-9.802-19.458-15.757
            c0-5.281,6.279-10.93,19.846-10.93c11.318-0.179,19.536,2.292,25.912,4.869l3.121,1.468L351.141,197.152L351.141,197.152z"
              fill="#005098"
            />
            <path
              d="M439.964,194.144h-26.766c-8.295,0-14.496,2.262-18.14,10.538l-51.438,116.47h36.378
            c0,0,5.931-15.66,7.287-19.1c3.974,0,39.305,0.059,44.363,0.059c1.027,4.447,4.206,19.041,4.206,19.041h32.152L439.964,194.144
            L439.964,194.144z M397.248,276.062c2.868-7.326,13.8-35.53,13.8-35.53c-0.194,0.339,2.849-7.36,4.593-12.132l2.346,10.959
            c0,0,6.628,30.336,8.022,36.703H397.248L397.248,276.062z"
              fill="#005098"
            />
            <path
              d="M161.828,194.114l-33.917,86.667l-3.624-17.607c-6.299-20.312-25.971-42.309-47.968-53.317l31.009,111.149
            l36.649-0.048l54.538-126.844H161.828L161.828,194.114z"
              fill="#005098"
            />
            <path
              d="M96.456,194.037H40.581l-0.426,2.641c43.452,10.523,72.213,35.946,84.133,66.496l-12.133-58.41
            C110.062,196.716,103.976,194.318,96.456,194.037L96.456,194.037z"
              fill="#F6A500"
            />
          </g>
        </g>
      </svg>
    ),
    MasterCard: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        id="Layer_1"
        viewBox="0 0 128 128"
        width="80px"
        height="50px"
        xmlSpace="preserve"
      >
        <g>
          <g>
            <path
              d="M112,16H16C7.164,16,0,23.164,0,32v64c0,8.836,7.164,16,16,16h96c8.836,0,16-7.164,16-16V32
            C128,23.164,120.836,16,112,16z M120,96c0,4.414-3.59,8-8,8H16c-4.412,0-8-3.586-8-8V32c0-4.414,3.588-8,8-8h96
            c4.41,0,8,3.586,8,8V96z"
              fill="#B0BEC5"
            />
          </g>
        </g>
        <path
          d="M104,64c0,13.254-10.746,24-24,24S56,77.254,56,64s10.746-24,24-24S104,50.746,104,64z"
          fill="#FFA000"
        />
        <path
          d="M72,64c0,13.254-10.746,24-24,24S24,77.254,24,64s10.746-24,24-24S72,50.746,72,64z"
          fill="#D32F2F"
        />
      </svg>
    ),
  };
  // startProject with charge
  const [dialogState, setDialogState] = useState(0);
  // 2 state => watch all cards + add card button
  // 0 start => confirm => / api create account => / show cards + add card button (<= back) (confirm (in-case card was selected else disabled)) => api chargeCustomer => success, fail => toast show
  const [cardSelectedState, setCardSelectedState] = useState(-1);
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [price, setPrice] = useState(0);
  const handleClickFirstConfirm = async (email: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/create-customer`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return {
      status: response.data.status,
      message: response.data.message,
    };
  };
  const email = useSelector<RootState>(
    (state) => state.user.user.email,
  ) as string;

  const { mid }: { mid: string } = useParams();
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const userID = session?.user.id;
  const username = session?.user.username ?? "";
  const token = session?.user.token;
  const [isOpen, setIsOpen] = useState(false);
  const [participantsRight, setParticipantsRight] = useState<
    ParticipantForRight[] | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const [noFinishCandidate, setNoFinishCandidate] = useState<string[]>([]);
  const handleFetchPrice = async (postId: string) => {
    //v1/posts/1/sumCandidateOffer
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postId}/sumCandidateOffer`;
    const res = await axios.get(apiUrl, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("pricing", res);
    setPrice(res.data.data);
  };
  const handleStartProject = async (token: string) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${mid}/startProject`;
    setIsLoading(true);
    const res = await axios.put(
      apiUrl,
      {},
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("resStartProject", res);
    setIsLoading(false);

    if (!res) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Please try again.",
      });
      return;
    }
    toast({
      variant: "default",
      title: "Successful approve work",
      description: `Mask post success.`,
    });
    refreshPost();
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.async = true;
    script.onload = () => {
      (window as any).Omise.setPublicKey(
        process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
      );
    };
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (userRole === "producer") {
          response = await getPostParticipantCandidate(
            mid,
            session?.user.token ?? "",
          ); // ดึงโพสต์ของ producer
        } else if (userRole === "production professional") {
        }
        if (response) {
          setParticipantsRight(response);

          let particpantNoFinish: string[] = [];
          response?.forEach((eachParticipant) => {
            // console.log("part",eachParticipant.participantIDs)
            if (
              !eachParticipant.isSend &&
              eachParticipant.workQuota &&
              eachParticipant.workQuota > 0
            ) {
              particpantNoFinish.push(
                eachParticipant.participantID?.firstname
                  ? eachParticipant.participantID?.firstname
                  : eachParticipant.participantID?.username,
              );
            }
          });
          setNoFinishCandidate(particpantNoFinish);
        }
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
      }
    };
    fetchData();
  }, [userID, userRole, refreshKey]);

  const refreshParticipants = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  async function sendConfirm(approve: boolean) {
    const approveData: ApproveData = {
      isApprove: true,
      userId: "",
    };
    const postCreateResponse = await putApproveWork(
      mid,
      approveData,
      token ?? "",
    );
    if (!postCreateResponse || postCreateResponse != "success") {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Please try again.",
      });
      return;
    }
    refreshPost();
    refreshParticipants();
    toast({
      variant: "default",
      title: "Successful approve work",
      description: `Mask post success.`,
    });
  }
  if (!participantsRight) {
    return (
      <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%] relative">
        <h1 className="text-center text-xl font-bold my-5 ml-10 p-0">
          Loading Professional Logs
        </h1>
        <LinearProgress />
      </main>
    );
  }
  const handleDialogStateZeroConfirm = async () => {
    const returnData = await handleClickFirstConfirm(email);
    if (returnData.status) {
      setDialogState(1);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cards`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session?.user.token ?? ""}`,
          },
        },
      );
      console.log("res cards", res);
      setCards(res.data.data);
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: returnData.message,
      });
    }
  };
  const handleChargeCustomer = async (cardId: string, amount: number) => {
    setIsLoading(true);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/charge-customer`,
      {
        cardId,
        amount,
        postId: mid,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session?.user.token ?? ""}`,
        },
      },
    );
    console.log("charge-customer", res);
    const status = res.data.status;
    const message = res.data.message;
    if (status === "success") {
      // toast({
      //     variant: "default",
      //     title: "Success",
      //     description: message,
      // });
      await handleStartProject(token ?? "");
      setIsLoading(false);
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: message,
      });
    }
    setOpen(false);
  };
  return (
    <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%] relative">
      <div className="grid grid-cols-1  w-full">
        <h1 className="text-start text-xl font-bold my-5 ml-10 p-0">
          Production Professional
        </h1>
        <div className="w-[90%] m-auto content-center">
          <div className="w-full grid grid-cols-11 h-full bg-mainblue-darkest m-auto text-sm p-5 font-bold text-white text-center whitespace-normal break-words items-center content-center rounded-lg">
            <div className="col-span-2">
              <p className="">Name</p>
            </div>
            <div className="col-span-2">
              <p className="">Role</p>
            </div>
            <div className="col-span-2">
              <p className="">Status</p>
            </div>
            <div className="col-span-3">
              <p className="">Confirmation</p>
            </div>
            <div className="col-span-2">
              <p className="">Work Quota</p>
            </div>
          </div>
          <div
            className="overflow-y-auto h-full max-h-[400px] m-auto bg-slate-100"
            data-testid="Professional-working-cards"
          >
            {participantsRight ? (
              participantsRight.map((eachCard: ParticipantForRight) => (
                <ProfessionalWorkingCard
                  key={eachCard.participantID._id}
                  postStatus={postStatus}
                  participantDetail={eachCard}
                  setRefreshKey={refreshParticipants}
                />
              ))
            ) : (
              <LinearProgress />
            )}
          </div>
        </div>
      </div>
      {/*ยังไม่มี waiting ให้ใช้ */}

      {postStatus === "created" && userRole == "producer" && (
        <Link href={`/edit-post/${mid}`}>
          <Button
            className="absolute bg-maingreen text-white p-3 rounded-md hover:bg-maingreen-light shadow-lg right-5 bottom-5"
            data-test-id="edit-mypost-button"
          >
            Edit Post
          </Button>
        </Link>
      )}

      {postStatus === "waiting" && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            onClick={async () => {await handleFetchPrice(mid); setIsLoading(false); setDialogState(0); setCardSelectedState(-1)}}
            className="absolute bg-maingreen text-white p-3 rounded-md hover:bg-maingreen-light shadow-lg right-5 bottom-5"
          >
            <span>Start Project</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {dialogState === 0 ? `Confirm Start the project (${price} THB)`: "Payment"}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                {dialogState === 0 ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-black">
                      You are about to start the project. This action will
                      initiate the production phase. Do you want to proceed?
                    </p>

                    <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">
                      Warning: Some required roles for this project are still
                      unfilled. The following positions.
                    </div>

                    
                  </div>
                ) : (
                  <div className="h-[500px] overflow-y-scroll">
                    {cards.map((card, index) => (
                      <div
                        onClick={() => setCardSelectedState(index)}
                        key={index}
                        className="w-full h-[80px] border rounded-xl flex"
                      >
                        <div className="w-[20%]  flex items-center justify-center">
                          {cardMapper[card?.brand]}
                        </div>

                        <div className="w-[50%] flex flex-col justify-center ml-2">
                          <span>
                            {card?.brand} **** {card.last_digits}
                          </span>
                          <span>{`Expired ${card.expiration_month}/${card.expiration_year}`}</span>
                        </div>

                        <div className="w-[30%] flex items-center justify-center">
                          {cardSelectedState === index && (
                            <CircleCheck
                              size={30}
                              className="text-maingreen-light"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <Button
                onClick={() =>
                  dialogState === 0 ? setOpen(false) : setDialogState(0)
                }
              >
                {dialogState === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                className="bg-maingreen"
                onClick={async () =>
                  dialogState === 0
                    ? await handleDialogStateZeroConfirm()
                    : await handleChargeCustomer(
                        cards[cardSelectedState].id,
                        price,
                      )
                }
                disabled={
                  participantsRight.length == 0 ||
                  (dialogState === 1 && cardSelectedState === -1) ||
                  isloading
                }
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {postStatus === "in-progress" && (
        <AlertDialog>
          <AlertDialogTrigger className="absolute bg-maingreen text-white p-3 rounded-md hover:bg-maingreen-light right-5 bottom-5">
            Mark as Complete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirm Mark Project as Completed
              </AlertDialogTitle>
              <AlertDialogDescription className="text-black" asChild>
                <div className="flex flex-col gap-2">
                  <p className="text-black">
                    You are about to mark the post as complete. This action
                    confirms that the project is finished and both parties have
                    agreed.
                  </p>
                  {noFinishCandidate?.length > 0 ? (
                    <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">
                      {`Beware there are ${noFinishCandidate?.join(",")} that may be not finished their work and they will get nothing`}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-green-700" asChild>
                <Button
                  onClick={(e) => {
                    sendConfirm(true);
                  }}
                >
                  Confirm
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  );
}
