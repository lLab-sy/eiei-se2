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
    profileImage: "/image/logo.png",
    description: "Experienced media professional with expertise in cinematography, lighting, and video editing.",
    occupation: "Videographer",
    skill: ["Cameraman", "Lighting", "Editing"],
    experience: "10", // Years of experience
    rating: 5.0,
  };

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl bg-white">
        {/* Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">Professional Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6 p-6">
          {/* Image Carousel */}
          <div className="w-full max-w-md">
            <Carousel className="rounded-lg shadow-md bg-gray-50 p-2">
              <CarouselContent>
                {img.length !== 0 ? (
                  img.map((imgSrc) => (
                    <CarouselItem key={imgSrc} className="flex justify-center">
                      <Image
                        src={imgSrc}
                        alt="Professional Image"
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
                      alt="Default Profile Image"
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
            <p className="text-lg text-maingrey flex items-center justify-center gap-2">
              <Briefcase className="h-5 w-5 text-mainblue-lightest" />
              {ProfessionalInfo.occupation}
            </p>
            <p className="text- mt-3">{ProfessionalInfo.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-mainblue-lightest" />
              <span className="text-maingrey">Gender: {ProfessionalInfo.gender}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-mainblue-lightest" />
              <span className="text-maingrey">Experience: {ProfessionalInfo.experience} years</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-mainblue-lightest" />
              <span className="text-maingrey">{ProfessionalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-mainyellow" />
              <span className="text-maingrey">Rating: {ProfessionalInfo.rating}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-maingreen" />
              <span className="text-maingrey">{ProfessionalInfo.phoneNumber}</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-maingrey mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {ProfessionalInfo.skill.map((skill) => (
                <span key={skill} className="bg-blue-100 text-mainblue-lightest text-sm px-3 py-1 rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <a href="mailto:{ProfessionalInfo.email}" className="bg-mainblue-lightest text-white py-3 px-8 rounded-lg shadow-md hover:bg-mainblue-light transition-colors duration-300">
              Contact
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDetail;
