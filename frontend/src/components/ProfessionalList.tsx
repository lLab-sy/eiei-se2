// src/components/ProfessionalList.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Professional, ProfessionalsData } from "../../interface";
import getProfessionals from "@/libs/getProfessionals";
import { Star } from "lucide-react";

const ProfessionalList: React.FC = () => {
  // กำหนดให้แสดงเพียง 4 รายการในหน้าแรก
  const PAGE_SIZE = 4;

  // state สำหรับเก็บข้อมูล professionals
  const [professionals, setProfessionals] = useState<Professional[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // เรียกใช้ API เพื่อดึงข้อมูล Production Professional
        const requestPage = `?limit=${PAGE_SIZE}&page=1`;
        const requestFilter = "&minRating=0";

        console.log("Getting Professionals...");
        const response = await getProfessionals(requestPage + requestFilter);

        if (response && response.data) {
          setProfessionals(response.data);
        } else {
          setError("ไม่พบข้อมูล Production Professional");
        }
      } catch (err) {
        console.error("Error fetching professionals:", err);
        setError("ไม่สามารถดึงข้อมูล Production Professional ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
          <h2 className="text-xl sm:text-2xl font-bold">
            Recommended Professionals
          </h2>
          <Link
            href="/professionals"
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            See more ...
          </Link>
        </div>

        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
        </div>
      </section>
    );
  }

  if (error || !professionals || professionals.length === 0) {
    return (
      <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
          <h2 className="text-xl sm:text-2xl font-bold">
            Recommended Professionals
          </h2>
          <Link
            href="/professionals"
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            See more ...
          </Link>
        </div>

        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">
            {error || "ไม่พบข้อมูล Production Professional"}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
        <h2 className="text-xl sm:text-2xl font-bold">
          Recommended Professionals
        </h2>
        <Link
          href="/professionals"
          className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          See more ...
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {professionals.map((professional, index) => (
          <Link
            href={`/professional/${professional._id}`}
            key={index}
            className="group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={professional.imageUrl || "/api/placeholder/300/300"}
                alt={professional.username}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex flex-col items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center px-4">
                  <h3 className="font-bold text-lg mb-1">
                    {professional.firstName
                      ? `${professional.firstName} ${professional.lastName}`
                      : professional.username}
                  </h3>

                  <p className="text-sm font-medium mb-2">
                    {professional.occupation || "Production Professional"}
                  </p>

                  <div className="flex items-center justify-center mb-2">
                    <Star
                      className="w-4 h-4 text-yellow-400 mr-1"
                      fill="currentColor"
                    />
                    <span>{professional.avgRating?.toFixed(1) || "N/A"}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{professional.experience || 0} years</span>
                  </div>

                  {professional.skill && professional.skill.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {professional.skill.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-blue-500 bg-opacity-30 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProfessionalList;
