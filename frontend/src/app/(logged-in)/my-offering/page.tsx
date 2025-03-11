"use client";
import PostToOffer from "@/components/PostToOffer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MediaType, PostData, RoleType } from "../../../../interface";
import PostCard from "@/components/PostCard";
import getMediaTypes from "@/libs/getMediaTypes";
import getPostRoles from "@/libs/getPostRoles";
// interface postData {
//     postName : string,
//     postImage : Array<string>,
//     postMediaType:
// }
export default function OfferPage() {
  const { data: session, status } = useSession();
  // const token = Cookies.get('token')
  // console.log('cookie', token)
  // const token = getTokenObject()
  // const handleCookie = async () => {
  //   const cookieStore = await cookies()
  //   const token = cookieStore.get('token')
  //   console.log('cookie token', token)
  // }
  // handleCookie()
  // console.log('token from cookie', token)
  const [postArray, setPostArray] = useState<Array<PostData>>([]);
  console.log(session);
  useEffect(() => {
    const handleFetch = async (postStatus: string) => {
      const query = `?postStatus=${postStatus}&limit=10&page=1`;
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/user/prof${query}`;
      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      console.log("postres", res);
      setPostArray(res?.data?.data?.data);
    };
    handleFetch("created");
  }, []);
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
      </div>
    </main>
  );
}
