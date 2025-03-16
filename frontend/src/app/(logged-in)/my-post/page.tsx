"use client"
import { useEffect, useState } from "react";
import { PostData, SearchPosts } from "../../../../interface";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import MyPostCard from "@/components/MyPostCard";
import { useSession } from "next-auth/react";
import SearchPostBar from "@/components/SearchPostBar";
import MyPostBar from "@/components/MyPostBar";
import getPosts from "@/libs/getPosts";
import getMyProducerPosts from "@/libs/getMyProducerPosts";

export default function MyPost() {
 

  const PAGE_SIZE = 12;
  const { data: session } = useSession();
  const userRole=session?.user.role
  const userID=session?.user.id
  const token=session?.user.token

  const [PostsCurrentPage, setPostsCurrentPage] = useState<PostData[]|null>(null)  //Post That In one Page
  const [currentPage, setCurrentPage] = useState(1); //In Page ... (number)
  const [totalPages, setTotalPages] = useState(1); //All Page (What it contain)
  const [requestPage, setRequestPage] = useState("limit="+PAGE_SIZE.toString()+"&page=1+&postStatus=created"); //Case of Change PAGE
  const [requestFilter, setRequestFilter] = useState("");
  const [dataResponse,setDataResponse]= useState<SearchPosts|null>(null);
  
  const handlePageChange = (page: number) => {
    setRequestPage("limit="+PAGE_SIZE.toString()+"&page="+page.toString());
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: string) => {
    handlePageChange(1);
    setRequestFilter(filter);
  };
  //For Result of MyPostBar and initial active
  useEffect(()=>{
      const fetchData=async()=>{
          
          var response;
          // console.log(requestPage + requestFilter);
          try{
            response= await getMyProducerPosts(requestPage + requestFilter,token??"")
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

  return (
    <div className="min-h-screen bg-gray-50 ">

      {/*Header*/}
      <div className="top-0 bg-mainblue-light z-10 py-4">
        <div className="flex justify-center items-center space-x-4">
          {/* <SearchPostBar onSearch = {handleFilterChange}/> */}
            <MyPostBar onSearch={handleFilterChange}/>
        </div>
      </div>

      <div className="flex mt-14 lg:px-20 text-3xl font-bold text-gray-800 justify-center items-center">
          My Post
      </div>
      
      {/* Grid Layout */}
      <div className="min-h-screen p-14 bg-gray-50 px-8 lg:px-20">
      {PostsCurrentPage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
          {
          PostsCurrentPage.map((post, index) => (
            <MyPostCard
              key={index}
              role={userRole??"admin"}        
              />
            ))
          }
 
          {/* <MyPostCard role={userRole??"admin"}/>
          <MyPostCard role={userRole??"admin"}/>
          <MyPostCard role={userRole??"admin"}/>
          <MyPostCard role={userRole??"admin"} isReview={true}/> */}

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