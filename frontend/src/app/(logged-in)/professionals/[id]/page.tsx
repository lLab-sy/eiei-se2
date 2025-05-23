"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Phone, Star, User, Award } from "lucide-react";
import { Professional, ReceivedReviews} from "../../../../../interface";
import getUser from "@/libs/getUser";
import ReviewCard from "@/components/ReviewCard";
import getReviewProfesstional from "@/libs/getReviewProfesstional";
import ReviewProfessional from "@/components/ReviewProfessional";
import { set } from "react-hook-form";

const ProfessionalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [img, setImg] = useState<string[]>([]);
  const [dataResponse,setDataResponse]= useState<Professional|null>(null);
  const [dataReviews, setDataReviews]= useState<ReceivedReviews|null>(null);

    useEffect(()=>{
      const fetchData=async()=>{
          var responseData;
          var responseReviewProf;
          try{
            responseData = await getUser(id);
            setDataResponse(responseData);
            
            console.log("test", responseData);
          }catch(error){
            console.log("User Not Found");
          }

          try{
            responseReviewProf = await getReviewProfesstional(id);
            setDataReviews(responseReviewProf);
            console.log(responseReviewProf);
          }catch(error){
            console.log("Review not found");
          }
      }
      fetchData()
  },[id]);

  if (!dataResponse) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }else{
    var sum = 0;
      dataResponse?.rating.forEach((rate) => {
          sum += rate.ratingScore;
      })
      dataResponse.avgRating = dataResponse.rating.length ? Math.ceil((sum / dataResponse.rating.length) * 10) / 10 : 0.0;
  }
  console.log("DATA RESPONSE",dataResponse)
  const ProfessionalInfo = {
    id: dataResponse._id,
    firstName: dataResponse.firstName || "N/A",
    lastName: dataResponse.lastName || "N/A",
    email: dataResponse.email || "N/A",
    phoneNumber: dataResponse.phoneNumber || "N/A",
    gender: dataResponse.gender || "N/A",
    imageUrl: dataResponse.url || '/image/logo-preview.webp',
    description: dataResponse.description || "",
    occupation: dataResponse.occupation || "",
    skill: dataResponse.skill || [],
    experience: dataResponse.experience || 0.0,
    rating: dataResponse.rating || 0.0,
    avgRating: dataResponse.avgRating || 0.0,
    username: dataResponse.username,
  };
  console.log(ProfessionalInfo)
  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl bg-white p-8">
        {/* Header */}
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-semibold text-gray-800">Professional Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Carousel */}
                    <div className="w-full flex justify-center">
                       <Carousel className="w-full">
                              <CarouselContent>
                              {(ProfessionalInfo.imageUrl && ProfessionalInfo.imageUrl.length != 0) ? (

                              <CarouselItem key={ProfessionalInfo.imageUrl} className="flex justify-center">
                                <Card className="relative w-full aspect-video">
                                  <Image
                                    src={ProfessionalInfo.imageUrl}//imgSrc}
                                    alt="Project Image"
                                    // width={300}
                                    // height={300}
                                    fill
                                    className="rounded-lg object-cover shadow-sm"
                                    priority
                                  />
                                </Card>
                              </CarouselItem>
                            
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

          {/* Professional Info */}
          <div className="w-full text-center space-y-3">
            {ProfessionalInfo.firstName != "N/A" ? 
              <h2 className="text-2xl font-bold text-main-gery">{ProfessionalInfo.firstName} {ProfessionalInfo.lastName}</h2> :
              <h2 className="text-2xl font-bold text-main-gery">{ProfessionalInfo.username}</h2>
            }
            {ProfessionalInfo.occupation != "" ? <div className="w-full text-center">
              <span className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-2 rounded-full shadow-sm"> {ProfessionalInfo.occupation} </span>
            </div> : <></>}
          </div>
          {ProfessionalInfo.description != "" ? <p>&nbsp;&nbsp;&nbsp;&nbsp;{ProfessionalInfo.description}</p> : <></>}
          
          <div className="grid grid-cols-2 gap-10 place-items-start h-full">
            {/* Project Status Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="flex items-center gap-2 font-medium"><User className="h-5 w-5 text-mainblue-lightest" />{ProfessionalInfo.gender}</p>
                <p className="flex items-center gap-2 font-medium"><Mail className="h-5 w-5 text-mainblue-lightest" />{ProfessionalInfo.email}</p>
                <p className="flex items-center gap-2 font-medium"><Phone className="h-5 w-5 text-maingreen" />{ProfessionalInfo.phoneNumber}</p>
              </div>
            </div>

            {/* Project Owner Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Experience</h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="flex items-center gap-2 font-medium"><Award className="h-5 w-5 text-mainblue-lightest" /> Experience: {ProfessionalInfo.experience} years</p>
                <p className="flex items-center gap-2 font-medium"><Star className="h-5 w-5 text-mainyellow" /> Rating: {ProfessionalInfo.avgRating}</p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {ProfessionalInfo.skill.length != 0 ?  <div className="flex items-center gap-2 justify-center">
            <div className="flex flex-wrap gap-2 ">
              <h3 className="font-semibold text-maingrey text-center">Roles : </h3>
              {ProfessionalInfo.skill.map((skill) => (
                <span key={skill} className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-1 rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div> : <></>}

          <div className="mt-6 flex justify-center">
            <a href={`/create-offer/${id}`} className="bg-mainblue-lightest text-white py-3 px-8 rounded-lg shadow-md hover:bg-mainblue-light transition-colors duration-300">
              Send Offer
            </a>
          </div>

            {/*Review Section*/}
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Previously Received Reviews</h3>
            <ReviewProfessional id={id} />


        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDetail;
