"use client";

import { FC, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Professional {
  name: string;
  image: string;
  id: string;
  role?: string;
}


const professionals: Professional[] = Array(4)
  .fill({
    name: "Nac Nao",
    image: "/api/placeholder/100/100",
    id: "1",
    role: "Actor",
  })
  .map((pro, index) => ({
    ...pro,
    id: String(index + 1),
  }));

const ProfessionalList: FC = () => {
  const {data:session} = useSession()
  const role = session?.user?.role ?? ''

  return (
    role === "production professional" ? <></>:
    <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
        <h2 className="text-xl sm:text-2xl font-bold">
          Looking for Professional?
        </h2>
        <Link
          href="/professionals"
          className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          See more ...
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {professionals.map((pro) => (
          <Link
            href={`/professional/${pro.id}`}
            key={pro.id}
            className="flex flex-col items-center bg-white p-3 sm:p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 sm:mb-3 md:mb-4">
              <Image
                src={pro.image}
                alt={pro.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="font-medium text-sm sm:text-base text-center">
              {pro.name}
            </span>
            {pro.role && (
              <span className="text-gray-600 text-xs sm:text-sm mt-1">
                {pro.role}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  ) ;
};

export default ProfessionalList;
