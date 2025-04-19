"use client"
import { useEffect, useState } from "react";
import React from "react";
import { ProfessionalsData, Professional } from "../../../../interface";
import SearchBar from "@/components/SearchBar";
import ProfessionalCard from "@/components/ProfessionalCard";
import Pagination from "@/components/Pagination";
import getProfessionals from "@/libs/getProfessionals";

const PAGE_SIZE = 12;

const ProfessionalsPage = () => {

  // requestFilter
  // 
  const [requestFilter, setRequestFilter] = useState("&minRating=0");

  // page
  const [requestPage, setRequestPage] = useState("?limit="+PAGE_SIZE.toString()+"&page=1");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // data
  const [dataResponse,setDataResponse]= useState<ProfessionalsData|null>(null);
  const [professtionalsCurrentPage, setProfesstionalsCurrentPage] = useState<Professional[]|null>(null)

  useEffect(()=>{
    const fetchData=async()=>{
        
        var response;
        try{
          console.log("Getting Professionals...")
          response= await getProfessionals(requestPage + requestFilter)
          console.log("getProfessionals response",response)
        }catch(error){
          setTotalPages(1);
          handlePageChange(1);
          setDataResponse(null);
          setProfesstionalsCurrentPage(null);
          console.log("Request Not Found");
        }
        if (response) {
          setDataResponse(response);
        }
        
    }
    fetchData()
},[requestFilter, requestPage]);

  useEffect(() => {
    if (dataResponse) {
      setTotalPages(dataResponse.meta.totalPages);
      setProfesstionalsCurrentPage(dataResponse.data); // Update professionals list
    }
  }, [dataResponse]);

  const handlePageChange = (page: number) => {
    setRequestPage("?limit="+PAGE_SIZE.toString()+"&page="+page.toString());
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: string, rating: number) => {
    handlePageChange(1);
    setRequestFilter(filter + "&minRating=" + rating.toString());
  };

  return (
    <div className="sticky min-h-screen bg-gray-50 ">

      {/*Header*/}
      <div className="top-0 bg-mainblue-light z-10 py-4">
        <div className="flex justify-center items-center space-x-4">
          <SearchBar onSearch={handleFilterChange}/>
        </div>
      </div>

      <div className="flex mt-14 lg:px-20 text-3xl font-bold text-gray-800 justify-center items-center">
        Suggested Production Professional
      </div>
      
      {/* Grid Layout */}
      <div className="min-h-screen p-14 bg-gray-50 px-8 lg:px-20">
      {professtionalsCurrentPage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
            {professtionalsCurrentPage.map((professional, index) => (
              <ProfessionalCard
                key={index}
                title={professional.firstName ? (professional.firstName + " " + professional.lastName) : professional.username }
                description={professional?.description ? (professional.description.length > 100 ? professional.description.slice(0, 100) : professional.description) : ""}
                imageUrl={professional?.profileImage || ""}
                skill={professional?.skill}
                ratings={Number(professional?.avgRating) || 0}
                occupation={professional?.occupation || ""}
                experience={professional?.experience || 0}
                id={professional?._id}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-xl text-gray-600">
            Data not found
          </div>
        )}
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
