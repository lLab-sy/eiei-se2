"use client"

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
export default function ProfessionalWorkingCard({postStatus}:{postStatus?:string}){ 
//   const offerDate = new Date(data.createdAt);
//   const displayDate = offerDate.toLocaleString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

  const getStatusText = (status: string) => {
    switch (status) {
      case "candidate":
        return "Employed";
      case "reject":
        return "Banned";
      case "in-progress":
        return "Waiting";
      default:
        return status;
    }
  };


  return (
    <div className="w-full grid grid-cols-10 bg-slate-100 m-auto text-sm my-2 p-5 font-medium text-center whitespace-normal break-words h-[30px] items-center content-center">
        <div className="col-span-2">
            <p className="">Pro1</p>
        </div>
        <div className="col-span-2">
            <p className="">Actor</p>
        </div>
        <div className="col-span-2">
            <p className="text-sm">In-Progress</p>
        </div>
        <div className="col-span-2 space-x-1">
        {/* แล้วต่อไปต้องมี isSend ด้วย */}
        {postStatus === "in-progress" && (
        <>
        <AlertDialog>
          <AlertDialogTrigger><CheckBoxIcon className="  bg-maingreen hover:brightness-110 cursor-pointer hover:bg-mainblue-dark" /></AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are You Sure to Confirm This Task (1/5)</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-2">
                    <p className="text-black">This submission will mark this task as complete according to the agreement. </p>
                    <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">Upon confirmation, $15,000 will be transferred to the production professional account.</div>
                </div>
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-maingreen" asChild> 
                    <Button
                      >Confirm</Button>
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger><DisabledByDefaultIcon className="bg-mainred hover:brightness-110 cursor-pointer hover:bg-mainblue-dark"/></AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are You Sure to Request to fix Task (1/5)</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-2">
                    <p className="text-black">Requesting a resubmission from professionalName. professionalName will need to make corrections and resubmit the work.</p>
                    <div className="bg-mainyellow-light p-5 rounded-lg text-mainred font-bold">Important: If revisions reach 5/5, the payment will be voided for all parties..</div>
                </div>
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-green-700" asChild> 
                    <Button
                      >Confirm</Button>
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>
        )}
        </div>
        <div className="col-span-2">
            <p className=""> 0/5</p>
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