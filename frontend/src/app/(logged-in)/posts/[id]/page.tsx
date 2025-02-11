"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Phone, Star, User, Calendar } from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const [img, setImg] = useState<string[]>([]);

  const PostInfo = {
    postName: "Marvel Studios",
    postDescription: "We are seeking a talented and creative videographer to capture dynamic behind-the-scenes footage for our upcoming movie project. The ideal candidate should have experience in shooting documentary-style content, the ability to anticipate key moments on set, and a keen eye for storytelling through visuals. This role involves documenting the energy, interactions, and creative process during filming to give audiences an exclusive peek into the making of the film. Responsibilities include filming candid moments, interviews with cast and crew, and capturing the overall atmosphere of the production. Strong editing skills are a plus but not mandatory. We’re looking for someone enthusiastic about film and who thrives in fast-paced, collaborative environments. If you're passionate about storytelling and have a knack for capturing authentic moments, we’d love to hear from you.",
    postImages: [],
    postMediaType: "Video",
    postProjectRoles: ["Videographer", "Editor"],
    postStatus: "Created",
    startDate: "2022-10-01",
    endDate: "2022-10-31",
    price: "100",
    firstName: "John",
    lastName: "Doe",
    email: "realMarvelStudio@yahoo.com",
    phoneNumber: "123-456-7890",
  };

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl bg-white p-8">
        {/* Header */}
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-semibold text-gray-800">Project Overview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Carousel */}
          <div className="w-full flex justify-center">
            <Carousel className="rounded-lg shadow-md bg-gray-50 p-2">
              <CarouselContent>
                {PostInfo.postImages.length !== 0 ? (
                  PostInfo.postImages.map((imgSrc) => (
                    <CarouselItem key={imgSrc} className="flex justify-center">
                      <Image
                        src={imgSrc}
                        alt="Project Image"
                        width={300}
                        height={300}
                        className="rounded-lg object-cover shadow-sm"
                        priority
                      />
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
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Project Name */}
          <div className="w-full text-center space-y-3">
            <h2 className="text-2xl font-bold text-main-gery">{PostInfo.postName}</h2>
            <div className="w-full text-center">
              <span className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-2 rounded-full shadow-sm"> {PostInfo.postMediaType} </span>
            </div>
          </div>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;{PostInfo.postDescription}</p>

          {/* Project Detail Section */}
          <div className="place-content-center grid grid-cols-1 gap-3">
             <div className="flex items-center gap-2 justify-center">
                <div className="flex flex-wrap gap-2 ">
                  <h3 className="font-semibold text-maingrey text-center">Roles : </h3>
                  {PostInfo.postProjectRoles.map((skill) => (
                    <span key={skill} className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-1 rounded-full shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text- font-semibold text-maingrey text-center">Budget : {PostInfo.price} Bath</h3>
          </div>
         
          <div className="place-content-center grid grid-cols-2 gap-4 place-items-center h-full">
            {/* Project Status Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Project Status</h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="flex items-center gap-2 font-medium"><Star className="w-5 h-5 text-yellow-500" /> Status: {PostInfo.postStatus}</p>
                <p className="flex items-center gap-2 font-medium"><Calendar className="w-5 h-5 text-green-500" /> Start Date: {PostInfo.startDate}</p>
                <p className="flex items-center gap-2 font-medium"><Calendar className="w-5 h-5 text-red-500" /> End Date: {PostInfo.endDate}</p>
              </div>
            </div>

            {/* Project Owner Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Project Owner</h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="flex items-center gap-2 font-medium"><User className="w-5 h-5 text-blue-500" /> {PostInfo.firstName} {PostInfo.lastName}</p>
                <p className="flex items-center gap-2 font-medium"><Mail className="w-5 h-5 text-red-500" /> {PostInfo.email}</p>
                <p className="flex items-center gap-2 font-medium"><Phone className="w-5 h-5 text-orange-500" /> {PostInfo.phoneNumber}</p>
              </div>
            </div>
          </div>
          

          {/* Contact Button */}
          <div className="mt-6 flex justify-center">
            <a href={`mailto:${PostInfo.email}`} className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
              Contact Owner
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
