"use client";
import PostToOffer from "@/components/PostToOffer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostData } from "../../../../interface";
import { Button } from "@/components/ui/button";

// นำเข้า mock data (ปรับตามที่จัดเก็บไฟล์ mockData ของคุณ)
import { mockPosts } from "@/mock/mockData";
import getPostUser from "@/libs/getPostsUser";

export default function OfferPage() {
  const { data: session, status } = useSession();
  const [postArray, setPostArray] = useState<Array<PostData>>([]);
  const [error, setError] = useState<string | null>(null);
  const userRole=session?.user.role
  const userID=session?.user.id

  if(!userID || !userRole){
    return <>Unautorize</>
  }

  console.log(session);

//----------------------------------------------------------------
useEffect(() => {
  const fetchData = async () => {
    try {
      let response;
      if (userRole === "producer") {
        response = await getPostUser(userID); // ดึงโพสต์ของ producer
      } else if (userRole === "production professional") {
        response = mockPosts
      }
      console.log("response",response)
      setPostArray(response)
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
    }
  };
  fetchData();
}, [userID, userRole]); // ใช้ pid และ token ใน dependency array

  // useEffect(() => {
  //   // สมมติว่าเราดึงบทบาทของผู้ใช้จาก session หรือ Redux store
  //   // ในตัวอย่างนี้เราสมมติให้ดึงจาก session
  // //----------------------------------------------------------------
  //   // const handleFetch = async (postStatus: string) => {
  //   //   // ใช้ mock data แทนการเรียก API จริง
  //   //   setPostArray(mockPosts);

  //   //   // เมื่อทำจริงควรใช้ endpoint ที่แตกต่างกันตามบทบาท
  //   //   /*
  //   //   const endpoint = userRole === 'producer' 
  //   //     ? 'posts/user/prod'  // สำหรับ Producer ดูโพสต์ของตัวเอง
  //   //     : 'posts/user/prof'; // สำหรับ Professional ดูโพสต์ที่มี
        
  //   //   const query = `?postStatus=${postStatus}&limit=10&page=1`;
  //   //   const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/${endpoint}${query}`;
  //   //   const res = await axios.get(apiUrl, {
  //   //     withCredentials: true,
  //   //     headers: {
  //   //       Authorization: `Bearer ${session?.user?.token}`,
  //   //     },
  //   //   });
  //   //   console.log("postres", res);
  //   //   setPostArray(res?.data?.data?.data);
  //   //   */
  //   // };

  //   handleFetch("created");
  // }, [session]);

  console.log("postArrayData", postArray);
  const router = useRouter();
  const handleChangePage = (postID: string) => {
    router.push(`/my-offering/${postID}`);
  };
  return (
    <main className="h-[100vh] flex flex-col gap-3 relative">
      <div className="mt-20 gap-5 flex flex-col">
        <span className="text-5xl font-bold flex justify-center">Post</span>
        <div className="flex flex-col gap-5">
          {(postArray && postArray?.length > 0) ? postArray.map((post, index) => (
            <div
                key={index}
              className="cursor-pointer"
              onClick={() => handleChangePage(post?.id!)}
            >
              <PostToOffer post={post}/>
            </div>
          )) : ""}
          
        </div>
      </div>
    </main>
  );
}
