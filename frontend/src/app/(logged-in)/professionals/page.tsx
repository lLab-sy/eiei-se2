"use client"
import { useEffect, useState } from "react";
import React from "react";
import { ProfessionalsData, Professionals } from "../../../../interface";
import SearchBar from "@/components/SearchBar";
import ProfessionalCard from "@/components/ProfessionalCrad";
import Pagination from "@/components/Pagination";
import getProfessionals from "@/libs/getProfessionals";

const PAGE_SIZE = 32;

////////// For testing 
/*const professionals = Array.from({ length: 259 }, (_, index) => ({
  title: `John Doe ${index + 1}`,
  skill: ["Cameraman", "Lighting", "Editing"],
  description: "My name is John Doe and I am a professional videographer.",
  ratings: (Math.random() * 5),
  occupation: "Videographer",
  imageUrl: "https://via.placeholder.com/150",
  experience: 10,
  id: index.toString(),
}));*/

const ProfessionalsPage = () => {

  const [request, setRequest] = useState("");
  const [dataResponse,setDataResponse]= useState<ProfessionalsData|null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [professtionalsCurrentPage, setProfesstionalsCurrentPage] = useState<Professionals[]|null>(null)

  useEffect(()=>{
    const fetchData=async()=>{
        
        var response;
        try{
          response= await getProfessionals(request)
        }catch(error){
          response = await getProfessionals("");
          console.log("Request Not Found");
        }

        if (response) {
          setDataResponse(response);
        }
        
    }
    fetchData()
},[request])

  useEffect(() => {
    if (dataResponse) {
      setTotalPages(dataResponse.meta.totalPages);
      // console.log(dataResponse)
      setProfesstionalsCurrentPage(dataResponse.data); // Update professionals list
      //console.log("Updated Data Response:", dataResponse);
    }
  }, [dataResponse]);

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

  const handleFilterChange = (filter: string) => {
    setRequest(filter);
  };

  return (
    <div className="sticky min-h-screen bg-gray-50 ">

      {/*Header*/}
      <div className="top-0 bg-mainblue-light z-10 py-4">
        <div className="flex justify-center items-center space-x-4 mt-20">
          <SearchBar onSearch={handleFilterChange}/>
        </div>
      </div>

      <div className="flex mt-14 lg:px-20 text-3xl font-bold text-gray-800 justify-center items-center">
        Suggested Production Professional
      </div>
      
      {/* Grid Layout */}
      <div className="min-h-screen p-14 bg-gray-50 px-8 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
          {professtionalsCurrentPage && professtionalsCurrentPage.map((professional, index) => (
            <ProfessionalCard
              key={index}
              title={professional?.firstName + " " + professional?.lastName}
              description={professional?.description || ""}
              imageUrl={professional?.imageUrl || ""} 
              skill={professional?.skill} 
              ratings={Number(professional?.ratingAvg) || 0} 
              occupation={professional?.occupation}
              experience={professional?.experience}
              id={professional?._id}          
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
