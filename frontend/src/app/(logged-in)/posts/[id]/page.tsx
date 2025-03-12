// frontend/src/app/(logged-in)/posts/[id]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail, Phone, Star, User, Calendar } from "lucide-react";
import { MediaType, PostData, ReceivedReviews, RoleType, UserData } from "../../../../../interface";
import getPostById from "@/libs/getPostById";
import { useSession } from "next-auth/react";
import getMediaTypes from "@/libs/getMediaTypes";
import getPostRoles from "@/libs/getPostRoles";
import getUser from "@/libs/getUser";
import ReviewCard from "@/components/ReviewCard";
import getReviewProfesstional from "@/libs/getReviewProfesstional";

const PostDetail = () => {

  const { id } = useParams<{ id: string }>();
  const [img, setImg] = useState<string[]>([]);
  // post data
  const [dataResponse,setDataResponse]= useState<PostData|null>(null);

  //Owner Data
  const [ownerResponse, setOwnerResponse] = useState<UserData|null>(null);
  const [dataReviews, setDataReviews]= useState<ReceivedReviews|null>(null);

  // all types
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [roleTypes, setRoleTypes] = useState<RoleType[]>([]);

  const { data: session } = useSession();

  if(!session){
    const handleSendOffer = () => {
      console.log("Send offer clicked");
    };
  
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  const token=session.user?.token
  const userName=session.user?.username
  const role= session.user.role

  const fetchData = async() => {

    var response;
    var userResponse;
    try{
      response = await getPostById(id, token);
      setDataResponse(response);
      console.log("Hello Post Data",response )
      try{
        userResponse = await getUser(response.userID);
        setOwnerResponse(userResponse);
      }catch(error){
        console.log("Owner Not Found");
      }


    }catch(error){
      console.log("Post Not Found");
    }

    var medias, roles;
      
    try{
      medias = await getMediaTypes();
      setMediaTypes(medias.data.data);
    }catch(error){
      console.log("MediaTypes Not Found");
    }

    try{
      roles = await getPostRoles();
      setRoleTypes(roles.data.data);
    }catch(error){
      console.log("Post Role Not Found");
    }
  }

  const fetchDataReview=async()=>{
      if(!ownerResponse) return;

      var responseReview;
      try{
        responseReview = await getReviewProfesstional(ownerResponse._id);
        setDataReviews(responseReview);
      }catch(error){
        console.log("Review not found");
      }
  }

  useEffect(()=>{
      if(dataResponse && !dataResponse.postProjectRoles){
        dataResponse.postProjectRolesOut?.forEach((e) => {
          if (!dataResponse.postProjectRoles) {
            dataResponse.postProjectRoles = [];
          }
          dataResponse.postProjectRoles.push(e.id);
        })
      }
  },[dataResponse]);

  if (!dataResponse || !ownerResponse) {
    fetchData();
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }else if(ownerResponse != null && !dataReviews){
    fetchDataReview();
  }

  const getMedia = (id: string) => {
    var result = "Unknow";
    mediaTypes.forEach(element => {
      if(element.id == id) result = element.mediaName;
    });
    return result;
  }

  const getRole = (id: string) => {
    var result = "Unknow";
    roleTypes.forEach(element => {
      if(element.id == id) result = element.roleName;
    });
    return result;
  }

  const getRoles = (ids: string[]) => {
    var roles: string[] = [];
    ids.forEach(id => roles.push(getRole(id)));
    return roles;
  }

  const getDate = (date: string) => {
    return date.split("T")[0];
  }

  const PostInfo = {
    postName: dataResponse.postName,
    postDescription: dataResponse.postDescription,
    postImageDisplay: dataResponse.postImageDisplay,
    postMediaType: getMedia(dataResponse.postMediaType) ,
    postProjectRoles: getRoles(dataResponse.postProjectRoles || []),
    postStatus: dataResponse.postStatus ,
    startDate: getDate(dataResponse.startDate || "N/AT") ,
    endDate: getDate(dataResponse.endDate || "N/AT"),
    firstName: ownerResponse?.firstName || "N/A",
    lastName: ownerResponse?.lastName || "N/A",
    email: ownerResponse?.email || "N/A",
    phoneNumber: ownerResponse?.phoneNumber || "N/A",
  };
  console.log("dataReview: ",dataReviews)
  console.log("post data", PostInfo)

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl bg-white p-8">
        {/* Header */}
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-semibold text-gray-800">
            Project Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Carousel */}
          <div className="w-full flex justify-center">
             <Carousel className="w-full">
                    <CarouselContent>
                    {(PostInfo.postImageDisplay && PostInfo.postImageDisplay.length != 0) ? (
                  PostInfo.postImageDisplay.map((img) => (
                    <CarouselItem key={img.imageKey} className="flex justify-center">
                      <Card className="relative w-full aspect-video">
                        <Image
                          src={img.imageURL}//imgSrc}
                          alt="Project Image"
                          // width={300}
                          // height={300}
                          fill
                          className="rounded-lg object-cover shadow-sm"
                          priority
                        />
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="flex justify-center">
                    <Image
                      src="/image/logo.png"
                      alt="Default Project Image"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover shadow-sm"
                      priority
                    />
                  </CarouselItem>
                )}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
          </div>

          {/* Project Name */}
          <div className="w-full text-center space-y-3">
            <h2 className="text-2xl font-bold text-main-gery">
              {PostInfo.postName}
            </h2>
            <div className="w-full text-center">
              <span className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-2 rounded-full shadow-sm">
                {" "}
                {PostInfo.postMediaType}{" "}
              </span>
            </div>
          </div>
          <p className="text-main-gery break-words whitespace-normal">&nbsp;&nbsp;&nbsp;&nbsp;{PostInfo.postDescription}</p>

          {/* Project Detail Section */}
          <div className="place-content-center grid grid-cols-1 gap-3">
             <div className="flex items-center gap-2 justify-center">
                <div className="flex flex-wrap gap-2 ">
                  <h3 className="font-semibold text-maingrey text-center">Roles : </h3>
                  {PostInfo.postProjectRoles.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-1 rounded-full shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {/*<h3 className="text- font-semibold text-maingrey text-center">Budget : {PostInfo.price} Bath</h3>*/}
          </div>

          <div className="place-content-center grid grid-cols-2 gap-4 place-items-center h-full">
            {/* Project Status Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Project Status
              </h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="flex items-center gap-2 font-medium">
                  <Star className="w-5 h-5 text-yellow-500" /> Status:{" "}
                  {PostInfo.postStatus}
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <Calendar className="w-5 h-5 text-green-500" /> Start Date:{" "}
                  {PostInfo.startDate}
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <Calendar className="w-5 h-5 text-red-500" /> End Date:{" "}
                  {PostInfo.endDate}
                </p>
              </div>
            </div>

            {/* Project Owner Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Project Owner</h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="flex items-center gap-2 font-medium">
                  <User className="w-5 h-5 text-blue-500" />{" "}
                  {PostInfo.firstName} {PostInfo.lastName}
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <Mail className="w-5 h-5 text-red-500" /> {PostInfo.email}
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <Phone className="w-5 h-5 text-orange-500" />{" "}
                  {PostInfo.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Button */}
          <div className="mt-6 flex justify-center">
            <a
              href={`/create-offer/${id}`}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Send Offer
            </a>
          </div>
          
          {/*Review Section*/}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Producer's Previously Received Reviews</h2>
            {dataReviews != null && dataReviews.receivedReviews && dataReviews.receivedReviews.length > 0 ? (
              dataReviews.receivedReviews.map((review, index) => (
                review.ratingScore > 0 ?
                <ReviewCard
                        key={index}
                        index={index}
                        reviewerName={review.reviewerName}
                        reviewerProfileImage={review.reviewerProfileImage}
                        ratingScore={review.ratingScore}
                        comment={review.comment}
                      /> : <></>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}

          </div>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
function useSessionContext(): { session: any; } {
  throw new Error("Function not implemented.");
}

