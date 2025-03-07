"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Phone, Briefcase, Star, User, Award } from "lucide-react";
import { Professional, ReceivedReviews} from "../../../../../interface";
import getUser from "@/libs/getUser";
import getReviewProfesstional from "@/libs/getReviewProfesstional";

const ProfessionalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [img, setImg] = useState<string[]>([]);
  const [dataResponse,setDataResponse]= useState<Professional|null>(null);
  //const [dataReviews, setDataReviews]= useState<ReceivedReviews|null>(null);

    useEffect(()=>{
      const fetchData=async()=>{
          var responseData;
          var responseReviewProf;
          try{
            responseData = await getUser(id);
            setDataResponse(responseData);
          }catch(error){
            console.log("User Not Found");
          }

          try{
            //responseReviewProf = await getReviewProfesstional(id);
            //setDataReviews(responseReviewProf);
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

  const dataReviews: ReceivedReviews = {
    receivedReviews: [
      {
        reviewerName: "John Doe",
        reviewerProfileImage: "/image/logo.png",
        ratingScore: 5,
        comment: "Excellent service! Highly recommended."
      },
      {
        reviewerName: "Jane Smith",
        reviewerProfileImage: "/image/logo.png",
        ratingScore: 4,
        comment: "Very professional and skilled. Would hire again."
      },
      {
        reviewerName: "Alice Johnson",
        reviewerProfileImage: "/image/logo.png",
        ratingScore: 3,
        comment: "Good experience overall, but there's room for improvement."
      }
    ]
  };

  const ProfessionalInfo = {
    id: dataResponse,
    firstName: dataResponse.firstName,
    lastName: dataResponse.lastName,
    email: dataResponse.email,
    phoneNumber: dataResponse.phoneNumber,
    gender: dataResponse.gender,
    profileImage: dataResponse.imageUrl,
    description: dataResponse.description,
    occupation: dataResponse.occupation,
    skill: dataResponse.skill,
    experience: dataResponse.experience,
    rating: dataResponse.rating,
    avgRating: dataResponse.avgRating,
  };

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
            <Carousel className="rounded-lg shadow-md bg-gray-50 p-2">
              <CarouselContent>
                {ProfessionalInfo.profileImage ? (
                    <CarouselItem key={JSON.stringify(ProfessionalInfo.profileImage)} className="flex justify-center">
                      <Image
                        src={JSON.stringify(ProfessionalInfo.profileImage)}
                        alt="Project Image"
                        width={300}
                        height={300}
                        className="rounded-lg object-cover shadow-sm"
                        priority
                      />
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
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Professional Info */}
          <div className="w-full text-center space-y-3">
            <h2 className="text-2xl font-bold text-main-gery">{ProfessionalInfo.firstName} {ProfessionalInfo.lastName}</h2>
            <div className="w-full text-center">
              <span className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-2 rounded-full shadow-sm"> {ProfessionalInfo.occupation} </span>
            </div>
          </div>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;{ProfessionalInfo.description}</p>
          
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
          <div className="flex items-center gap-2 justify-center">
            <div className="flex flex-wrap gap-2 ">
              <h3 className="font-semibold text-maingrey text-center">Roles : </h3>
              {ProfessionalInfo.skill.map((skill) => (
                <span key={skill} className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-1 rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <a href={`mailto:${ProfessionalInfo.email}`} className="bg-mainblue-lightest text-white py-3 px-8 rounded-lg shadow-md hover:bg-mainblue-light transition-colors duration-300">
              Contact
            </a>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
            {dataReviews != null && dataReviews.receivedReviews.length > 0 ? (
              dataReviews.receivedReviews.map((review, index) => (
                <div key={index} className="border-b py-4">
                  <div className="flex items-center gap-4">
                    <Image src={review.reviewerProfileImage} alt={review.reviewerName} width={40} height={40} className="rounded-full" />
                    <div>
                      <p className="font-semibold">{review.reviewerName}</p>
                      <div className="flex">
                        {[...Array(review.ratingScore)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
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

export default ProfessionalDetail;
