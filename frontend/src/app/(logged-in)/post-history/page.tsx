// frontend/src/app/(logged-in)/post-history/page.tsx

"use client";
import PostHistoryList from "@/components/PostHistoryList";
import { PostDataHistory } from "../../../../interface";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import getHistoryPosts from "@/libs/getHistoryPosts";
import session from "redux-persist/lib/storage/session";
import { useSession } from "next-auth/react";

//Mock Data
// const projects: Project[] = Array.from({ length: 45 }, (_, i) => ({
//     id: i + 1,
//     postName: `Project ${i + 1}`,
//     postDescription: `Movie`,
//     producer: "Producer Lee",
//     startDate: "26 October 2024",
//     endDate: "26 October 2024",
//     postMediaType: "Live Action",
//     postProjectRole: "actor",
//     postStatus: "success",
//     postImages: "/path-to-image.jpg",
//   }));

export default function HistoryPostPage() {
  const [postHistoryResponse, setPostHistoryResponse] = useState<
    PostDataHistory[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (status === "loading") return;

      if (!session?.user?.token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getHistoryPosts(session.user.token);
        setPostHistoryResponse(response.data.data);
      } catch (err) {
        console.error("Error fetching post history:", err);
        setError("Failed to fetch post history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-mainred">
        <p>{error}</p>
      </div>
    );
  }

  if (!postHistoryResponse) {
    return (
      <div className="p-4 text-center">
        <p>No history posts found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PostHistoryList
        postLists={postHistoryResponse}
        userName={session?.user?.username || ""}
        role={session?.user?.role || ""}
      />
    </div>
  );
}
