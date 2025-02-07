"use client"
import { useState } from "react";
import React from "react";

import Footer from "@/components/Footer";
import SearchPostBar from "@/components/SearchPostBar";
import Pagination from "@/components/Pagination";
import NavBar from "@/components/NavBar";
import PostCrad from "@/components/PostCard";

const PAGE_SIZE = 32;

////////// For testing
const posts = Array.from({ length: 259 }, (_, index) => ({
  title: `Post ${index + 1}`,
  role: ["Editor", "Videographer"],
  description: "This is post description.",
  mediaType: "Video Production",
  price: `฿${(Math.random() * 10000 + 1000).toFixed(0)}`,
  imageUrl: "https://via.placeholder.com/150"
}));

const ProfessionalsPage = () => {

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);

  const paginatedServices = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="sticky min-h-screen bg-gray-50 ">

      {/*Header*/}
      <div className="sticky top-0 bg-mainblue-light z-10 py-4">
        <div className="flex justify-center items-center space-x-4">
          <SearchPostBar />
        </div>
      </div>

      <div className="flex mt-14 lg:px-20 text-3xl font-bold text-gray-800 justify-center items-center">
        Suggested Post
      </div>
      
      {/* Grid Layout */}
      <div className="min-h-screen p-14 bg-gray-50 px-8 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
          {paginatedServices.map((professional, index) => (
            <PostCrad
              key={index}
              title={professional.title}
              description={professional.description}
              price={professional.price}
              imageUrl={professional.imageUrl} 
              role={professional.role} 
              mediaType={professional.mediaType}            
              />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pb-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      
      
      <Footer />
      
    </div>
  );
};

export default ProfessionalsPage;
