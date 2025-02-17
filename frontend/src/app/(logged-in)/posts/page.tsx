"use client"
import { useState, useEffect } from "react";
import React from "react";

import Footer from "@/components/Footer";
import SearchPostBar from "@/components/SearchPostBar";
import Pagination from "@/components/Pagination";
import PostCrad from "@/components/PostCard";
import { PostData, SearchPosts } from "../../../../interface";
import getPosts from "@/libs/getPosts";

const PAGE_SIZE = 12;

const ProfessionalsPage = () => {

  // requestFilter
  const [requestFilter, setRequestFilter] = useState("");

  //page
  const [requestPage, setRequestPage] = useState("?limit="+PAGE_SIZE.toString()+"&page=1");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // data
  const [dataResponse,setDataResponse]= useState<SearchPosts|null>(null);
  const [PostsCurrentPage, setPostsCurrentPage] = useState<PostData[]|null>(null)

  useEffect(()=>{
    const fetchData=async()=>{
        
        var response;
        console.log(requestPage + requestFilter);
        try{
          response= await getPosts(requestPage + requestFilter)
        }catch(error){
          setTotalPages(1);
          handlePageChange(1);
          setDataResponse(null);
          setPostsCurrentPage(null);
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
      setPostsCurrentPage(dataResponse.data); // Update professionals list
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
      <div className="sticky top-0 bg-mainblue-light z-10 py-4">
        <div className="flex justify-center items-center space-x-4 mt-20">
          <SearchPostBar onSearch = {handleFilterChange}/>
        </div>
      </div>

      <div className="flex mt-14 lg:px-20 text-3xl font-bold text-gray-800 justify-center items-center">
        Suggested Post
      </div>
      
      {/* Grid Layout */}
      <div className="min-h-screen p-14 bg-gray-50 px-8 lg:px-20">
      {PostsCurrentPage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
          {PostsCurrentPage.map((post, index) => (
            <PostCrad
              key={index}
              title={post.postName}
              description={post.postDescription}
              imageUrl={post.postImages? post.postImages[0] : ""} 
              role={post.postProjectRoles} 
              mediaType={post.postMediaType}
              id={post.userID}          
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
      
      
      
      <Footer />
      
    </div>
  );
};

export default ProfessionalsPage;
