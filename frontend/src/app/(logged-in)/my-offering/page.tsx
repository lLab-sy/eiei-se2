// frontend/src/app/(logged-in)/my-offering/page.tsx

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

export default function OfferPage() {
  const { data: session, status } = useSession();
  const [postArray, setPostArray] = useState<Array<PostData>>([]);
  const [userRole, setUserRole] = useState<"producer" | "professional">(
    "professional",
  );

  console.log(session);

  useEffect(() => {
    // สมมติว่าเราดึงบทบาทของผู้ใช้จาก session หรือ Redux store
    // ในตัวอย่างนี้เราสมมติให้ดึงจาก session
    const role = session?.user?.role || "professional";
    setUserRole(role as "producer" | "professional");

    const handleFetch = async (postStatus: string) => {
      // ใช้ mock data แทนการเรียก API จริง
      setPostArray(mockPosts);

      // เมื่อทำจริงควรใช้ endpoint ที่แตกต่างกันตามบทบาท
      /*
      const endpoint = userRole === 'producer' 
        ? 'posts/user/prod'  // สำหรับ Producer ดูโพสต์ของตัวเอง
        : 'posts/user/prof'; // สำหรับ Professional ดูโพสต์ที่มี
        
      const query = `?postStatus=${postStatus}&limit=10&page=1`;
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/${endpoint}${query}`;
      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      console.log("postres", res);
      setPostArray(res?.data?.data?.data);
      */
    };

    handleFetch("created");
  }, [session]);

  console.log("postArrayData", postArray);
  const router = useRouter();

  const handleChangePage = (postID: string) => {
    router.push(`/my-offering/${postID}`);
  };

  const handleCreatePost = () => {
    router.push("/create-post"); // สมมติว่ามีเส้นทางสำหรับการสร้างโพสต์
  };

  return (
    <main className="h-[100vh] flex flex-col gap-3 relative">
      <div className="mt-20 gap-5 flex flex-col">
        <div className="flex justify-between items-center px-[5%]">
          <span className="text-5xl font-bold">
            {userRole === "producer" ? "โพสต์ของฉัน" : "โพสต์ที่เปิดรับสมัคร"}
          </span>

          {/* แสดงปุ่มสร้างโพสต์เฉพาะสำหรับ Producer */}
          {userRole === "producer" && (
            <Button
              onClick={handleCreatePost}
              className="bg-mainblue hover:bg-mainblue-dark"
            >
              สร้างโพสต์ใหม่
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {postArray && postArray?.length > 0 ? (
            postArray.map((post, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => handleChangePage(post?.id!)}
              >
                <PostToOffer post={post} userRole={userRole} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">ไม่พบโพสต์</div>
          )}
        </div>
      </div>
    </main>
  );
}
