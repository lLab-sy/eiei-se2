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
            if (userRole == "production professional"){
              {/*wait for proper API <TO BE DISCUSSED> */}
            } else response= await getMyProducerPosts(requestPage + requestFilter,token??"")
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
import MyPostPanel from "@/components/MyPostPanel";
export default function MyPostPage() {

  return (
    <div className="min-h-screen bg-gray-50 ">
        <MyPostPanel/>
    </div>
  );
};