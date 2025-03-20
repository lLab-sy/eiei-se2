"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Phone, User } from "lucide-react";
import getUser from "@/libs/getUser";
import { UserData } from "../../../../../interface";

const ProducerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [dataResponse, setDataResponse] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getUser(id);
        setDataResponse(responseData);
      } catch (error) {
        console.log("User Not Found");
      }
    };
    fetchData();
  }, [id]);

  if (!dataResponse) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const ProducerInfo = {
    firstName: dataResponse.firstName || "N/A",
    lastName: dataResponse.lastName || "N/A",
    phoneNumber: dataResponse.phoneNumber || "N/A",
    gender: dataResponse.gender || "N/A",
    email: dataResponse.email || "N/A",
    imageUrl: dataResponse.imageUrl || "/image/logo.png",
  };

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl bg-white p-8">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-semibold text-gray-800">Producer Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Section */}
          <div className="w-full flex justify-center">
            <Carousel className="rounded-lg shadow-md bg-gray-50 p-2">
              <CarouselContent>
                <CarouselItem className="flex justify-center">
                  <Image
                    src={ProducerInfo.imageUrl}
                    alt={`${ProducerInfo.firstName} ${ProducerInfo.lastName}`}
                    width={300}
                    height={300}
                    className="rounded-lg object-cover shadow-sm"
                    priority
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="w-full text-center space-y-3">
            <h2 className="text-2xl font-bold text-main-gery">{ProducerInfo.firstName} {ProducerInfo.lastName}</h2>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-3 gap-6 place-items-center">
            <p className="flex items-center gap-2 font-medium">
              <User className="h-5 w-5 text-mainblue-lightest" /> {ProducerInfo.gender}
            </p>
            <p className="flex items-center gap-2 font-medium">
              <Mail className="h-5 w-5 text-mainblue-lightest" /> {ProducerInfo.email}
            </p>
            <p className="flex items-center gap-2 font-medium">
              <Phone className="h-5 w-5 text-maingreen" /> {ProducerInfo.phoneNumber}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerProfile;
