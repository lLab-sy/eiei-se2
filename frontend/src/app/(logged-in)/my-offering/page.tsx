"use client";
import PostToOffer from "@/components/PostToOffer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostData } from "../../../../interface";
// interface postData {
//     postName : string,
//     postImage : Array<string>,
//     postMediaType:
// }
export default function OfferPage() {
  const { data: session, status } = useSession();
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
