"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Suspense, lazy, useMemo } from "react";

export default function UserInfo({
  mobilePageState,
  userData,
  onImageChange,
  img,
  setMobilePageState,
  role,
}: {
  mobilePageState: number;
  userData: any;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  img: { image: string };
  setMobilePageState: Function;
  role: string;
}) {
  if (!userData) {
    return <div>Loading...</div>;
  }
  const AvatarProfile = useMemo(
    () => dynamic(() => import("./AvatarProfile"), { ssr: false }),
    [img],
  );
  const ProfileName = () => {
    return (
      <div className="mt-5 lg:mt-0 order-2 lg:order-1 text-2xl mb-2 lg:text-xl font-bold flex justify-center items-center">
        {`${userData.firstName} ${userData.middleName} ${userData.lastName}`}
      </div>
    );
  };
  const ProfileNameDynamic = useMemo(
    () => dynamic(() => Promise.resolve(ProfileName)),
    [userData.firstName , userData.middleName , userData.lastName ],
  );
  // const ProfileNameDynamic = dynamic(() => Promise.resolve(ProfileName))
  return (
    <Card
      className={`${mobilePageState == 0 ? "" : "hidden"} bg-slate-100 lg:bg-white  lg:visible h-[100vh] w-[100vw] lg:w-[400px]  lg:h-[700px] lg:flex lg:flex-col`}
    >
      <CardHeader>
        <CardTitle className="flex justify-center text-3xl lg:text-2xl lg:justify-start w-full">
          Profile
        </CardTitle>{" "}
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center">
        <AvatarProfile img={img} />
        <Suspense
          fallback={<div className="skeleton-placeholder">Loading...</div>}
        >
          <ProfileNameDynamic />
        </Suspense>

        <div className=" mt-5 lg:mt-0 order-3 lg:order-2 lg:w-full lg:flex flex-col items-center justify-center">
          <label
            htmlFor="picture"
            className="mt-5 w-[50%] bg-blue-500 text-white text-xl py-2 px-4 rounded-lg cursor-pointer text-center"
          >
            Upload File
          </label>
          <input
            id="picture"
            type="file"
            accept=".png, .jpeg, .gif, .webp"
            className="hidden"
            onChange={onImageChange}
          />
        </div>
        <div className="flex items-start order-6  bottom-0 w-[90%] left-[50%] translate-x-[-50%]  h-[20vh] absolute lg:hidden">
          <div className="bg-white flex justify-between items-center w-full rounded-xl h-[20%]">
            <div
              onClick={() => setMobilePageState(0)}
              className={`${mobilePageState == 0 ? "bg-slate-300" : ""} cursor-pointer ${role === "production professional" ? "w-[33%]" : "w-[50%]"} h-full flex justify-center items-center rounded-lg`}
            >
              Profile Image
            </div>
            <div
              onClick={() => setMobilePageState(1)}
              className={`${mobilePageState == 1 ? "bg-slate-300" : ""} cursor-pointer ${role === "production professional" ? "w-[33%]" : "w-[50%]"} h-full flex justify-center items-center rounded-lg`}
            >
              Edit Profile
            </div>
            {role === "production professional" ? (
              <div
                onClick={() => setMobilePageState(2)}
                className={`${mobilePageState == 2 ? "bg-slate-300" : ""} cursor-pointer w-[33%] h-full flex justify-center items-center rounded-lg`}
              >
                Review
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
