"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Phone, Briefcase, Star, User, Award } from "lucide-react";

const ProfessionalDetail = () => {
  const { id } = useParams();
  const [img, setImg] = useState<string[]>([]);

  const ProfessionalInfo = {
    id,
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    phoneNumber: "123-456-7890",
    gender: "Male",
    profileImage: ["/image/logo.png"],
    description: "Seasoned media professional with extensive expertise in cinematography, lighting design, and advanced video editing techniques. Adept at creating visually compelling content for various media formats, from films and commercials to digital campaigns and documentaries. Skilled in operating high-end camera systems, setting up intricate lighting schemes to enhance mood and aesthetics, and crafting seamless, engaging narratives through meticulous post-production editing.",
    occupation: "Videographer",
    skill: ["Cameraman", "Lighting", "Editing"],
    experience: "10", // Years of experience
    rating: 5.0,
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
                {ProfessionalInfo.profileImage.length !== 0 ? (
                  ProfessionalInfo.profileImage.map((imgSrc) => (
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
                <p className="flex items-center gap-2 font-medium"><Star className="h-5 w-5 text-mainyellow" /> Rating: {ProfessionalInfo.rating}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDetail;
