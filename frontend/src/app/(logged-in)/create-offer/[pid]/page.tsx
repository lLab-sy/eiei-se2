"use client";

import { use } from "react";
import PostSelect from "@/components/PostSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfferHistoryData, PostData, UserData } from "../../../../../interface";
import { useEffect, useState } from "react";
import OfferInformation from "@/components/OfferInformation";
import getPostUser from "@/libs/getPostsUser";
import getPostById from "@/libs/getPostById";
import { useSession } from "next-auth/react";
import { FaHistory } from "react-icons/fa";
import OfferHistoryMinimal from "@/components/OfferHistoryMinimal";
import { OfferHistoryMinimal2 } from "@/components/OfferHistoryMinimal2";
import getOfferHistory from "@/libs/getOffersHistory";
import getUser from "@/libs/getUser";
import Cookies from "js-cookie";
export default function CreateOfferPage({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const { data: session } = useSession();
  const { pid } = use(params);
  const userID = session?.user.id;
  const userRole = session?.user.role;
  const token = Cookies.get("token");
  // console.log("token", token);

  const mockImages = ["/image/logo.png", "/image/logo.png", "/image/logo.png"];
  const [postData, setPostData] = useState<PostData[] | null>();
  const [offerData, setOfferData] = useState<OfferHistoryData[] | null>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [postSelect, setPostSelect] = useState<PostData | null>();
  const [showOfferHistory, setShowOfferHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return early if no user is logged in
  if (!userID || !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Check if user role is valid
  if (userRole !== "producer" && userRole !== "production professional") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6 max-w-md">
          <CardTitle className="text-mainred mb-4">
            Unauthorized Access
          </CardTitle>
          <p>This page is only available for producers and professionals.</p>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        let responseOffer;
        var userResponse;

        if (userRole === "producer") {
          response = await getPostUser(userID, true); // ดึงโพสต์ของ producer
          userResponse = await getUser(pid);
          // responseOffer= await getOfferHistory(token,pid);
        } else if (userRole === "production professional") {
          response = await getPostById(pid, token); // ดึงโพสต์ตาม pid
          userResponse = await getUser(userID);
          // responseOffer= await getOfferHistory(token,userID);
        }
        setUserData(userResponse);
        // console.log("respons",response)
        if (response) {
          const posts = userRole === "producer" ? response : [response];
          setPostData(posts);
          // console.log("OKAY",posts[0].postImages)
          setPostSelect(posts[0] || null);

          // const res2= getOfferHistory(token,pid);
          // setOfferData(responseOffer)
        }
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
      }
    };
    if (userID && pid) fetchData();
  }, [userID, userRole, pid, token]); // ใช้ pid และ token ใน dependency array

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6 max-w-md">
          <CardTitle className="text-mainred mb-4">Error</CardTitle>
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  if (!postSelect || !postData || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap flex-row sm:w-4/5 w-full my-12 px-4">
        <Card className="w-full shadow-xl mt-10">
          <CardHeader className="justify-between flex flex-row">
            <CardTitle className="flex">
              {userRole === "producer"
                ? `Create Offer to ${userData?.username} `
                : `${userData?.username} (Owner)`}
              {/* รอแก้ Project Owner */}
            </CardTitle>
            {/* <FaHistory
              className="cursor-pointer hover:text-mainblue transition-colors"
              onClick={() => setShowOfferHistory(true)}
            /> */}
            <OfferHistoryMinimal2
              productionProfessionalName={pid}
              offerHistoryDatas={mockOfferHistory}
            />
          </CardHeader>

          <hr className="h-px bg-gray-300 border-0" />

          <PostSelect
            postData={postData}
            postSelectData={postSelect}
            changePostSelect={setPostSelect}
            userRole={userRole}
          />

          <div className="flex flex-row">
            <CardContent className="flex flex-col py-5 w-full">
              <CardTitle className="justify-start flex mb-5">
                Offer Information
              </CardTitle>
              <hr className="h-px bg-gray-300 border-0" />
              <OfferInformation
                postSelectData={postSelect}
                productionProfessionalID={
                  userRole === "producer" ? pid : userID
                }
                userRole={userRole}
              />
            </CardContent>
          </div>
        </Card>
      </div>

      {showOfferHistory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <OfferHistoryMinimal
            productionProfessionalName={pid}
            offerHistoryDatas={mockOfferHistory}
            onCloseWindow={() => setShowOfferHistory(false)}
          />
        </div>
      )}
    </div>
  );
}
