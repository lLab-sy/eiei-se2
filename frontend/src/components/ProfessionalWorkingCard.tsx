"use client"
import { useRouter } from "next/navigation";
import { Airplay } from "lucide-react";
import { Switch } from "./ui/switch";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
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
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { ApproveData, Participant, ParticipantForRight } from "../../interface";
import putApproveWork from "@/libs/putApproveWork";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProfessionalWorkingCard({postStatus,participantDetail,setRefreshKey}:{postStatus?:string,participantDetail:ParticipantForRight,setRefreshKey:Function}){ 
//   const offerDate = new Date(data.createdAt);
//   const displayDate = offerDate.toLocaleString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
  const { mid }: { mid: string } = useParams();
  const { data: session } = useSession();
  const token =session?.user.token;


  async function sendApprove (approve:boolean,participantID:string) {
    const approveData:ApproveData = {
      isApprove:approve,
      userId:participantID
    };
    const postCreateResponse = await putApproveWork(mid,approveData,token??"")
    if (!postCreateResponse || postCreateResponse != "success") {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Please try again.",
      })
      return
    }
      setRefreshKey()
      toast({
      variant: "default",
      title: "Successful approve work",
      description: `Balance is go to ${participantDetail.participantID.firstname?participantDetail.participantID.firstname:participantDetail.participantID.username}.`,
    })

  }

  return (
    <div className="w-full grid grid-cols-10 bg-slate-100 m-auto text-sm my-2 p-5 font-medium text-center whitespace-normal break-words h-[30px] items-center content-center">
        <div className="col-span-2">
            <p className="">{participantDetail.participantID.firstname?participantDetail.participantID.firstname:participantDetail.participantID.username}</p>
        </div>
        <div className="col-span-2">
            <p className="">{participantDetail.offer[participantDetail.offer.length - 1].role.roleName}</p>
        </div>
        <div className="col-span-2">
            <p className="text-sm">{participantDetail.isSend?"Sent":"In-Progress"}</p>
        </div>
        <div className="col-span-2 space-x-1">
        {/* แล้วต่อไปต้องมี isSend ด้วย */}
        {postStatus === "in-progress" && participantDetail.isSend && !participantDetail.isApprove && (
        <>
        <AlertDialog>
          <AlertDialogTrigger><CheckBoxIcon data-test-id={`Approve-${participantDetail.participantID._id}`} className="bg-maingreen hover:brightness-110 cursor-pointer hover:bg-mainblue-dark" /></AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are You Sure to Confirm This Task</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-2">
                    <p className="text-black">This submission will mark this task as complete according to the agreement. </p>
                    <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">{`Upon confirmation, ${participantDetail.offer[participantDetail.offer.length - 1].price} Baht will be transferred to the ${participantDetail.participantID.firstname?participantDetail.participantID.firstname:participantDetail.participantID.username} account.`}</div>
                </div>
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-maingreen" asChild> 
                    <Button onClick={(e:any)=>{sendApprove(true,participantDetail.participantID._id)}}
                      >Confirm</Button>
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger><DisabledByDefaultIcon data-test-id={`Reject-${participantDetail.participantID._id}`} className="bg-mainred hover:brightness-110 cursor-pointer hover:bg-mainblue-dark"/></AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are You Sure to Request to fix Task</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-2">
                    <p className="text-black">Requesting a resubmission from {participantDetail.participantID.firstname?participantDetail.participantID.firstname:participantDetail.participantID.username}. {participantDetail.participantID.username}  will need to make corrections and resubmit the work.</p>
                    <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">Important: If revisions reach 0, the {participantDetail.participantID.username} will no longer to send and payment will be voided for all parties.</div>
                </div>
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-green-700" asChild> 
                    <Button onClick={(e:any)=>{sendApprove(false,participantDetail.participantID._id)}}
                      >Confirm</Button>
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>
        )}
        </div>
        <div className="col-span-2">
            <p className=""> {participantDetail.workQuota}/3</p>
        </div>
    </div>
  );
}


{/* <div className="lg:col-span-2 m-auto">
<AlertDialog>
<AlertDialogTrigger className=" bg-mainblue text-white p-3 rounded-md hover:bg-sky-700 shadow-lg">Send Offer</AlertDialogTrigger>
<AlertDialogContent>
    <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
        This offer will send to him/her
    </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-green-700" asChild> 
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}>Confirm</Button>
        </AlertDialogAction>
    </AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
</div> */}