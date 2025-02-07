"use client"
import { useState } from "react";
import React from "react";

import SearchBar from "@/components/SearchBar";
import ProfessionalCard from "@/components/ProfessionalCrad";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 32;

////////// For testing 
const professionals = Array.from({ length: 259 }, (_, index) => ({
  title: `John Doe ${index + 1}`,
  skill: ["Cameraman", "Lighting", "Editing"],
  description: "My name is John Doe and I am a professional videographer.",
  ratings: (Math.random() * 5),
  occupation: "Videographer",
  imageUrl: "https://via.placeholder.com/150",
  experience: 10,
  id: index.toString(),
}));

const ProfessionalsPage = () => {

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(professionals.length / PAGE_SIZE);

  const paginatedServices = professionals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="sticky min-h-screen bg-gray-50 ">

      {/*Header*/}
      <div className="sticky top-0 bg-mainblue-light z-10 py-4">
        <div className="flex justify-center items-center space-x-4">
          <SearchBar />
        </div>
      </div>

      <div className="flex mt-14 lg:px-20 text-3xl font-bold text-gray-800 justify-center items-center">
        Suggested Production Professional
      </div>
      
      {/* Grid Layout */}
      <div className="min-h-screen p-14 bg-gray-50 px-8 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
          {paginatedServices.map((professional, index) => (
            <ProfessionalCard
              key={index}
              title={professional.title}
              description={professional.description}
              imageUrl={professional.imageUrl} 
              skill={professional.skill} 
              ratings={professional.ratings} 
              occupation={professional.occupation}
              experience={professional.experience}
              id={professional.id}          
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
    </div>
  );
};

export default ProfessionalsPage;
