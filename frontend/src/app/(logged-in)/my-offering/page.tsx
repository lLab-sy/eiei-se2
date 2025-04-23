"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MediaType, PostData, RoleType } from "../../../../interface";
import { Suspense, lazy } from "react";
// นำเข้า mock data (ปรับตามที่จัดเก็บไฟล์ mockData ของคุณ)
import getPostUser from "@/libs/getPostsUser";
import getPostRoles from "@/libs/getPostRoles";
import getMediaTypes from "@/libs/getMediaTypes";

export default function OfferPage() {
  const { data: session, status } = useSession();
  const [postArray, setPostArray] = useState<Array<PostData>>([]);
  const [error, setError] = useState<string | null>(null);
  const userRole = session?.user.role;
  const userID = session?.user.id;
  const PostCard = lazy(() => import("@/components/PostCard"))
  if (!userID || !userRole) {
    return <>Unautorize</>;
  }


  //----------------------------------------------------------------
  // useEffect(() => {
  //   const handleFetch = async (postStatus: string) => {
  //     const query = `?postStatus=${postStatus}&limit=10&page=1`;
  //     const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/user/prof${query}`;
  //     const res = await axios.get(apiUrl, {
  //       withCredentials: true,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log("postres", res);
  //     setPostArray(res?.data?.data?.data);
  //   };
  //   handleFetch("created");
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (userRole === "producer") {
          response = await getPostUser(userID); // ดึงโพสต์ของ producer
        } else if (userRole === "production professional") {
          const postStatus = "created,waiting,in-progress,success";
          const query = `?postStatus=${postStatus}&limit=10&page=1`;
          const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/user/prof${query}`;
          const res = await axios.get(apiUrl, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${session?.user?.token ?? ""}`,
            },
          });
          response = res?.data?.data?.data;
        }
        setPostArray(response);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
      }
    };
    fetchData();
  }, [userID, userRole]); // ใช้ pid และ token ใน dependency array

  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [roleTypes, setRoleTypes] = useState<RoleType[]>([]);
  const getMediaNameById = (id: string): string => {
    const mediaType = mediaTypes.find((media) => media.id === id);
    return mediaType ? mediaType.mediaName : "Unknown";
  };

  useEffect(() => {
    const fetchData = async () => {
      var medias, roles;

      try {
        medias = await getMediaTypes();
      } catch (error) {
        console.log("MediaTypes Not Found");
      }
      try {
        roles = await getPostRoles();
      } catch (error) {
        console.log("RoleTypes Not Found");
      }

      if (medias) {
        setMediaTypes(medias.data.data);
      }
      if (roles) {
        setRoleTypes(roles.data.data);
      }
    };
    fetchData();
  }, []);
  const getRoleById = (ids: string[]): string[] => {
    var result: string[] = [];
    ids.forEach((id) => {
      const roleType = roleTypes.find((role) => role.id === id);
      result.push(roleType ? roleType.roleName : "Unknown");
    });
    return result;
  };


  return (
    <main className=" min-h-screen mb-5 flex flex-col gap-3 relative">
      <div className="mt-20 gap-5 flex flex-col">
        <span className="w-full text-5xl font-bold flex justify-center">
          My Offering
        </span>
        <span className="text-4xl font-bold flex justify-start ml-7">Post</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-12 max-w-full">
          {postArray && postArray?.length > 0
            ? postArray.map((post, index) => (
                  <Suspense key={index} fallback={<div className='flex justify-center items-center'>
                    Loading posts...
                    </div>}>
                    <PostCard
                      title={post.postName}
                      description={post.postDescription}
                      imageUrl={
                        post.postImages && post.postImages.length !== 0
                          ? post.postImages[0]
                          : ""
                      }
                      role={getRoleById(post.postProjectRoles || [])}
                      mediaType={getMediaNameById(post.postMediaType)}
                      id={post.id!}
                      link={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/my-offering/${post.id}`}
                    />
                  </Suspense>
              ))
            : ""}
        </div>
      </div>
    </main>
  );
}
