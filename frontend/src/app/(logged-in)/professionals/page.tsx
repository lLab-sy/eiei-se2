"use client"
import { useEffect, useState } from "react";
import React from "react";
import { ProfessionalsData, Professionals } from "../../../../interface";
import SearchBar from "@/components/SearchBar";
import ProfessionalCard from "@/components/ProfessionalCrad";
import Pagination from "@/components/Pagination";
import getProfessionals from "@/libs/getProfessionals";

const PAGE_SIZE = 12;

const ProfessionalsPage = () => {

  // requestFilter
  const [requestFilter, setRequestFilter] = useState("");

  // page
  const [requestPage, setRequestPage] = useState("?limit="+PAGE_SIZE.toString()+"&page=1");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // data
  const [dataResponse,setDataResponse]= useState<ProfessionalsData|null>(null);
  const [professtionalsCurrentPage, setProfesstionalsCurrentPage] = useState<Professionals[]|null>(null)

  useEffect(()=>{
    const fetchData=async()=>{
        
        var response;
        console.log(requestPage + requestFilter);
        try{
          response= await getProfessionals(requestPage + requestFilter)
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
},[requestFilter, requestPage])

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

  const handleFilterChange = (filter: string) => {
    handlePageChange(1);
    setRequestFilter(filter);
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
      {professtionalsCurrentPage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
            {professtionalsCurrentPage.map((professional, index) => (
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
