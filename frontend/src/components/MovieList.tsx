// src/components/MovieList.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PostData, SearchPosts } from "../../interface";
import getPosts from "@/libs/getPosts";

const MovieList: React.FC = () => {
  // กำหนดให้แสดงเพียง 8 รายการในหน้าแรก
  const PAGE_SIZE = 8;

  // state สำหรับเก็บข้อมูล posts
  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // เรียกใช้ API เพื่อดึงข้อมูล Posts
        const requestPage = `limit=${PAGE_SIZE}&page=1`;

        console.log("Getting Posts...");
        const response = await getPosts(requestPage);

        if (response && response.data) {
          setPosts(response.data);
        } else {
          setError("ไม่พบข้อมูลโพสต์");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("ไม่สามารถดึงข้อมูลโพสต์ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
          <h2 className="text-xl sm:text-2xl font-bold">Job Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            See more ...
          </Link>
        </div>

        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
        </div>
      </section>
    );
  }

  if (error || !posts || posts.length === 0) {
    return (
      <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
          <h2 className="text-xl sm:text-2xl font-bold">Job Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            See more ...
          </Link>
        </div>

        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">{error || "ไม่พบข้อมูลโพสต์"}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
        <h2 className="text-xl sm:text-2xl font-bold">Job Posts</h2>
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          See more ...
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {posts.map((post, index) => (
          <Link href={`/posts/${post.id}`} key={index} className="group">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={
                  post.postImages && post.postImages.length > 0
                    ? post.postImages[0]
                    : "/api/placeholder/400/225"
                }
                alt={post.postName}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center px-4">
                  <h3 className="font-bold text-lg mb-1">{post.postName}</h3>
                  <p className="text-sm">
                    {post.postDescription.length > 60
                      ? post.postDescription.substring(0, 60) + "..."
                      : post.postDescription}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MovieList;
