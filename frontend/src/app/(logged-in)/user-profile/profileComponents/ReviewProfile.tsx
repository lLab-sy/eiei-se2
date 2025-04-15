"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReviewProfessional from "@/components/ReviewProfessional";
export default function ReviewProfile({
  role,
  mobilePageState,
  userData,
  setMobilePageState,
}: {
  role: string;
  mobilePageState: number;
  userData : any;
  setMobilePageState : Function;
}) {
  
  return (
    <>
      {role === "production professional" ? (
        <Card
          className={`${mobilePageState == 2 ? "" : "hidden"} bg-slate-100 lg:bg-white w-[100vw] h-[100vh] lg:inline lg:w-[535px] lg:h-[700px] relative`}
        >
          <CardHeader className="hidden lg:block">
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Separator className="mt-1" />
            <div className="mt-16 lg:mt-5 h-[70%] lg:h-[80%]">
              <ReviewProfessional id={userData?._id ?? ""} />
            </div>
            <div className="flex items-start order-6  bottom-0 w-[90%] left-[50%] translate-x-[-50%] h-[20vh] absolute lg:hidden">
              <div className="bg-white flex justify-between items-center w-full rounded-xl h-[20%]">
                <div
                  onClick={() => setMobilePageState(0)}
                  className={`${mobilePageState == 0 ? "bg-slate-300" : ""} cursor-pointer w-[33%] h-full flex justify-center items-center rounded-lg`}
                >
                  Profile Image
                </div>
                <div
                  onClick={() => setMobilePageState(1)}
                  className={`${mobilePageState == 1 ? "bg-slate-300" : ""} cursor-pointer w-[33%] h-full flex justify-center items-center rounded-lg`}
                >
                  Edit Profile
                </div>
                <div
                  onClick={() => setMobilePageState(2)}
                  className={`${mobilePageState == 2 ? "bg-slate-300" : ""} cursor-pointer w-[33%] h-full flex justify-center items-center rounded-lg`}
                >
                  Review
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        ""
      )}
    </>
  );
}
