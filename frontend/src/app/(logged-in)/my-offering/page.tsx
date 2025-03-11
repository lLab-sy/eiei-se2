"use client";
import PostToOffer from "@/components/PostToOffer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MediaType, PostData, RoleType } from "../../../../interface";
import { Button } from "@/components/ui/button";

// นำเข้า mock data (ปรับตามที่จัดเก็บไฟล์ mockData ของคุณ)
import { mockPosts } from "@/mock/mockData";
import getPostUser from "@/libs/getPostsUser";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import getPostRoles from "@/libs/getPostRoles";
import getMediaTypes from "@/libs/getMediaTypes";
import PostCard from "@/components/PostCard";

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
// useEffect(() => {
//   const handleFetch = async (postStatus: string) => {
//     const query = `?postStatus=${postStatus}&limit=10&page=1`;
//     const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/user/prof${query}`;
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
        const postStatus = "created"
        const query = `?postStatus=${postStatus}&limit=10&page=1`;
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/user/prof${query}`;
        const res = await axios.get(apiUrl, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session?.user?.token ?? ""}`,
          },
        });
        response = res?.data?.data?.data;
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
  const userData : any = useSelector<RootState>(state => state.user.user)
  console.log('userDataPostHistory', userData)
  console.log("postArrayData", postArray);
  const router = useRouter();
  const handleChangePage = (postID: string) => {
    router.push(`/my-offering/${postID}`);
  };
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [roleTypes, setRoleTypes] = useState<RoleType[]>([]);
  const getMediaNameById = (id: string): string => {
    const mediaType = mediaTypes.find((media) => media.id === id);
    return mediaType ? mediaType.mediaName : "Unknown";
  };
  useEffect(() => {
    const fetchData=async()=>{
        
      var medias, roles;
      
      try{
        medias = await getMediaTypes();
      }catch(error){
        console.log("MediaTypes Not Found");
      }
      try{
        roles = await getPostRoles();
      }catch(error){
        console.log("RoleTypes Not Found");
      }

      if (medias) {
        setMediaTypes(medias.data.data);
      }
      if(roles){
        setRoleTypes(roles.data.data);
      }
      
    }
    fetchData()
  }, []);
  const getRoleById = (ids: string[]): string[] => {

    var result: string[] = [];
    ids.forEach(id => {
      const roleType = roleTypes.find((role) => role.id === id);
      result.push(roleType ? roleType.roleName : "Unknown")
    });
    return result;
  };
  return (
    <main className="h-[100vh] flex flex-col gap-3 relative">
      <div className="mt-20 gap-5 flex flex-col">
        <span className="text-5xl font-bold flex justify-center">Post</span>
        {
          (userData?.role === 'producer') ? 
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
        :
        <div className="flex flex-wrap my-4 mx-8 gap-5 h-full">
        {(postArray && postArray?.length > 0) ? postArray.map((post, index) => (
          <div
              key={index}
            className="cursor-pointer"
            onClick={() => handleChangePage(post?.id!)}
          >
            <PostCard
              key={index}
              title={post.postName}
              description={post.postDescription}
              imageUrl={(post.postImages && post.postImages.length != 0)  ? post.postImages[0] : ''} 
              role={getRoleById(post.postProjectRoles || [])} 
              mediaType={getMediaNameById(post.postMediaType)}
              id={post.id}          
            />
          </div>
        )) : ""}
        
      </div>
        }
        
      </div>
    </main>
  );
}
